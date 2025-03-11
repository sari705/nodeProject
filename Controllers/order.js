import { orderModel } from "../Models/order.js";
import {userModel} from "../Models/user.js";
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

// export async function addOrder(req, res) {

//     let { body } = req;
//         let isErr = false;
//         let err;
//         if (!body.deadline) {
//             err += "deadline, ";
//             isErr = true;
//         }
    
//         if (!body.address) {
//             err += "address, ";
//             isErr = true;
//         }
    
//         if (!body.userId) {
//             err += "userId, ";
//             isErr = true;
//         }
    
//         if (!body.minimalProduct) {
//             err += "minimalProduct, ";
//             isErr = true;
//         }
    
//         if (!body.shippingPrice) {
//             err += "shippingPrice, ";
//             isErr = true;
//         }
    
//         if (!body.finalPrice) {
//             err += "finalPrice, ";
//             isErr = true;
//         }
    
    
//         if (isErr) {
//             return res.status(404).json({
//                 title: "missing detailes",
//                 message: err + "required",
//             });
//         }
    
//         if (!mongoose.Types.ObjectId.isValid(body.userId)) {
//             return res.status(400).json({
//                 title: "detailes are not correct",
//                 message: "user id is not valid",
//             });
//         }

//         try {
//             const userExists = await userModel.findById(body.userId);
//             if (!userExists) {
//                 return res.status(400).json({
//                     title: "details are not correct",
//                     message: "user does not exist",
//                 });
//             }
//         } catch (error) {
//             return res.status(500).json({
//                 title: "server error",
//                 message: "error checking user existence: " + error.message,
//             });
//         }
    
//         if (body.address.length<3) {
//             return res.status(400).json({
//                 title: "detailes are not correct",
//                 message: "the order address is too short",
//             });
//         }
    
//         if (body.minimalProduct.length<1) {
//             return res.status(400).json({
//                 title: "detailes are not correct",
//                 message: "the order minimalProduct is too low",
//             });
//         }
    
//         if (body.finalPrice<1) {
//             return res.status(400).json({
//                 title: "detailes are not correct",
//                 message: "the order final price is too low",
//             });
//         }
        
//         let newOrder = new orderModel({...body, isSetOff:false, Date:new Date(Date.now())});
//         try {
//             await newOrder.save();
//             res.json(newOrder);
//         } 
//         catch (e) {
//             res.status(400).json({ title: "adding new oredr faild", message: e.message });
//         }

// }
////////////////////////////////////////////////////////

//good
export const addOrder = async (req, res, next) => {
    let { body } = req;
    if (!body.userId || !body.adress || !body.productList || body.productList.length == 0)
      return res.status(404).json({
        title: "missing body data",
        message: "adress, userId ,productList are required",
      });
    for (let j = 0; j < body.productList.length; j++) {
      if (!body.productList[j].price || !body.productList[j]._id)
        return res.status(404).json({
          title: "missing body data",
          message: "_id and price in productList are required",
        });
      if (!body.productList[j].amount)
        body.productList[j].amount = 1;
    }
    try {
      let user = await userModel.findById(body.userId);
      if (!user)
        return res.status(404).json({ title: "no such user", message: "userId not found" });
  
      let productids = body.productList.map(item => item._id);
      let arrFullProducts = await productModel.find({ _id: { $in: productids } });
      console.log(productids, arrFullProducts)///בדיקה בשבילי
      if (arrFullProducts.length != productids.length)
        return res.status(404)
          .json({ title: "one or more products are invalid", message: "check if products are in store" });// היה רק כמה id ומצא לפיהם את המוצרים אם יש שלש id ורק שתי מוצרים מסיבה מסויימת ,למה שלא ימשיך קניה של שתי מוצרים ????? לסדר חשוב
      //עלול להווצר כאן בעיה שאם מישהו הכניס מחיר לא נכון על מוצר . לדעתי צריך לקחת את המחיר מהמערך של המוצרים המלאים .השאלה היא אם הם שווים בסדרם
      let cost = 0;
      for (let i = 0; i < body.productList.length; i++)
        cost += body.productList[i].price * body.productList[i].amount;
      //לשים לב : לא שמרתי את המערך המלא בתוך ההזמנה רק השתמשתי איתו לעזרתי אם אני מחליטה לשמור על המוצרים המלאים בתוך כל הזמנה אני צריכה לשנות 
      if (cost >= 200)
        body.shippingPrice = 0;
      else if (cost >= 100)
        body.shippingPrice = 15;
      else
        body.shippingPrice = 30;
  
      body.finalPrice = cost + body.shippingPrice;
  
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

