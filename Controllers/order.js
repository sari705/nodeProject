import { orderModel } from "../Models/order.js";
import mongoose from "mongoose"; 

export async function getAllOrders(req, res) {
    try {
        const orders = await orderModel.find()
        res.json({ orders })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}

export async function getOrderByUser(req, res) {
    try {
        let { id } = req.params;
        let data = await orderModel.find({userId:id})
        if (!data) {
            return res.status(404).json({
                title: "can`t get by id",
                message: "no order with such id " + id
            })
        }
        res.json({ data })
    }
    catch (e) {
        res.status("500").json({
            title: "server error",
            message: e.message
        })
    }
}

export async function addOrder(req, res) {

    let { body } = req;
        let isErr = false;
        let err;
        if (!body.deadline) {
            err += "deadline, ";
            isErr = true;
        }
    
        if (!body.address) {
            err += "address, ";
            isErr = true;
        }
    
        if (!body.userId) {
            err += "userId, ";
            isErr = true;
        }
    
        if (!body.minimalProduct) {
            err += "minimalProduct, ";
            isErr = true;
        }
    
        if (!body.shippingPrice) {
            err += "shippingPrice, ";
            isErr = true;
        }
    
        if (!body.finalPrice) {
            err += "finalPrice, ";
            isErr = true;
        }
    
    
        if (isErr) {
            return res.status(404).json({
                title: "missing detailes",
                message: err + "required",
            });
        }
    
        if (!mongoose.Types.ObjectId.isValid(body.userId)) {
            return res.status(400).json({
                title: "detailes are not correct",
                message: "user id is not valid",
            });
        }
    
        if (body.address.length<3) {
            return res.status(400).json({
                title: "detailes are not correct",
                message: "the order address is too short",
            });
        }
    
        if (body.minimalProduct.length<1) {
            return res.status(400).json({
                title: "detailes are not correct",
                message: "the order minimalProduct is too low",
            });
        }
    
        if (body.finalPrice<1) {
            return res.status(400).json({
                title: "detailes are not correct",
                message: "the order final price is too low",
            });
        }
        
        let newOrder = new orderModel({...body, isSetOff:false, Date: new Date()});
        try {
            await newOrder.save();
            res.json(newOrder);
        } 
        catch (e) {
            res.status(400).json({ title: "adding new oredr faild", message: e.message });
        }

}

export async function deleteOrder(req, res) {
    let { id } = req.params;
    let order = await orderModel.findById(id)
    if (!order.isSetOff) {
        try {
            let product = await productModel.deleteOne(order)
            if (!product) {
                return res.status(404).json({
                    title: "can`t get by id",
                    message: "no product with such id" + id
                })
            }
            res.json(product)
        }
        catch (e) {
            res.status("400").json(
                {
                    title: "could not delete",
                    message: e.message
                })
        }
    }
    else {
        return res.status(400).json({ title: "can not cancel", message: "order already set off" })
    }


}

export async function updateOrder(req, res) {
    let { id } = req.params;
    try {
        let data = await productModel.findByIdAndUpdate(id, {$set: {isSetOff:true}}, { new: true })
        if (!data) {
            return res.status("404").json({
                title: "not found",
                message: "no product with such id" + id
            })
        }
        res.json(data)
    }
    catch (e) {
        res.status("500").json(
            {
                title: "server error",
                message: e.message
            })
    }
}

