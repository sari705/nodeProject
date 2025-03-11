import { orderModel } from "../Models/order.js";
import { userModel } from "../Models/user.js";
import { productModel } from "../Models/product.js";

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
        let data = await orderModel.find({ userId: id })
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

//good
// minimalProduct
export const addOrder = async (req, res, next) => {
    let { body } = req;
    if (!body.userId || !body.address || !body.minimalProduct || body.minimalProduct.length == 0)
        return res.status(404).json({
            title: "missing body data",
            message: "address, userId ,minimalProduct are required",
        });
    for (let j = 0; j < body.minimalProduct.length; j++) {
        if (!body.minimalProduct[j].price || !body.minimalProduct[j]._id)
            return res.status(404).json({
                title: "missing body data",
                message: "_id and price in minimalProduct are required",
            });
        if (!body.minimalProduct[j].amount)
            body.minimalProduct[j].amount = 1;
    }
    try {
        let user = await userModel.findById(body.userId);
        if (!user)
            return res.status(404).json({ title: "no such user", message: "userId not found" });

        let productids = body.minimalProduct.map(item => item._id);
        let arrFullProducts = await productModel.find({ _id: { $in: productids } });
        console.log(productids, arrFullProducts)///בדיקה בשבילי
        if (arrFullProducts.length != productids.length)
            return res.status(404)
                .json({ title: "one or more products are invalid", message: "check if products are in store" });// היה רק כמה id ומצא לפיהם את המוצרים אם יש שלש id ורק שתי מוצרים מסיבה מסויימת ,למה שלא ימשיך קניה של שתי מוצרים ????? לסדר חשוב
        //עלול להווצר כאן בעיה שאם מישהו הכניס מחיר לא נכון על מוצר . לדעתי צריך לקחת את המחיר מהמערך של המוצרים המלאים .השאלה היא אם הם שווים בסדרם
        let cost = 0;
        for (let i = 0; i < body.minimalProduct.length; i++)
            cost += body.minimalProduct[i].price * body.minimalProduct[i].amount;
        //לשים לב : לא שמרתי את המערך המלא בתוך ההזמנה רק השתמשתי איתו לעזרתי אם אני מחליטה לשמור על המוצרים המלאים בתוך כל הזמנה אני צריכה לשנות 
        if (cost >= 200)
            body.shippingPrice = 0;
        else if (cost >= 100)
            body.shippingPrice = 15;
        else
            body.shippingPrice = 30;

        body.finalPrice = cost + body.shippingPrice;
        body.date = new Date();
        body.deadline.setDate(body.date.getDate() + 13);

        let newOrder = new orderModel(body);
        await newOrder.save();
        res.json(newOrder);
    } catch (err) {
        res.status(400).json({ title: "cannot save order", message: err.message });
    }
};


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
        let data = await productModel.findByIdAndUpdate(id, { $set: { isSetOff: true } }, { new: true })
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

