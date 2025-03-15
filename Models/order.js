import {Schema, model, ObjectId} from "mongoose";

const orderSchema=new Schema({
    date:{ type: Date, default: new Date() },
    deadline: Date,
    address: String,
    userId: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    minimalProduct:[{_id: String,
        name: String,
        price: Number,
        amount: { type: Number, default: 1 } 
    }],
    isSetOff:{ type: Boolean, default: false },
    shippingPrice:Number,
    finalPrice:Number,
})

export const orderModel = model("order", orderSchema);
