import { connect } from "mongoose"

export async function connectDB() {
    try {
        console.log("starting connecting")
        let connection = await connect(process.env.DB_URI)
        console.log("connected")
    }
    catch (err) {
        console.log("disconnected " + err);
        process.exit(1)
    }
}