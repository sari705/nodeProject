import { connect } from "mongoose"

export async function connectDB() {
    try {
        console.log("starting connecting")
        let connection = await connect(process.env.DB_URI||"mongodb://127.0.0.1:27017/shop")
        console.log("connected")
    }
    catch (err) {
        console.log("disconnected " + err);
        process.exit(1)
    }
}