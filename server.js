import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import {connectDB} from "./Config/db.js";
import productRouter from "./Routes/product.js";
import userRouter from "./Routes/user.js";
import orderRouter from "./Routes/order.js";
import { logToFile } from "./middlewares/logToFile.js";

const app = express();  
connectDB();


app.use(cors());
app.use(express.json())

app.use(logToFile);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);



let port = process.env.PORT;
app.listen(port, () => {
    console.log(`app is runing on port ${port}`);
})