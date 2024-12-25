import { orderModel } from "../Models/order.js";

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

export function addOrder(req, res) {

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

