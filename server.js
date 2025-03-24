import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { connectDB } from "./Config/db.js";
import productRouter from "./Routes/product.js";
import userRouter from "./Routes/user.js";
import orderRouter from "./Routes/order.js";
import enumRouter from "./Routes/enum.js";
import { logToFile } from "./middlewares/logToFile.js";
import session from "express-session";
import passport from "passport";
import "./Config/googleAuth.js";
import MongoStore from "connect-mongo";



const app = express();
connectDB();

const corsOptions = {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,  // זה מאפשר שליחה של credentials כמו cookies
};



app.use(cors(corsOptions));
app.use(express.json())

// ✅ הגדרת session לניהול התחברות
app.use(
    session({
        secret: process.env.SESSION_SECRET || "mySecretKey",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // הכתובת של MongoDB שלך
            dbName:"shop",
        }),
    })
);

// ✅ אתחול של Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use(logToFile);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/enums", enumRouter)



let port = process.env.PORT;
app.listen(port, '0.0.0.0', () => {
    console.log(`app is runing on port ${port}`);
})