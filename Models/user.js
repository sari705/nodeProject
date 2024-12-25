import {Schema, model } from "mongoose"

const userSchema = Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    date: Date,
})

export const userModel = model("user", userSchema)