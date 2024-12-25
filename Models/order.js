import {Schema, model, ObjectId} from "mongoose";

const orderSchema=new Schema({
    date: {type:Date, default:new Date()},
    deadline: Date,
    address: String,
    userId: {type: ObjectId, ref: "user"},
    minimalProduct:[{productName:String, amount:Number}],
    isSetOff:Boolean,
    shippingPrice:Number,
    finalPrice:Number,
})

export const orderModel = model("order", orderSchema)