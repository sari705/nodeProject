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


const app = express();
connectDB();


app.use(cors());
app.use(express.json())

// ✅ הגדרת session לניהול התחברות
app.use(
    session({
        secret: process.env.SESSION_SECRET || "mySecretKey",
        resave: false,
        saveUninitialized: true,
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