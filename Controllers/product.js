import { productModel } from "../Models/product.js";
import { validateSchema } from "../Models/product.js";
import joi from "joi";

export async function getAllProducts(req, res) {
    const page = req.query.page || 1;
    const limit = 9; // מספר מוצרים לכל דף
    const skip = (page - 1) * limit; // חישוב כמות המוצרים שיש לדלג עליהם
    try {
        const products = await productModel.find().skip(skip).limit(limit);
        res.json({ products })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}


export async function getProductsByCategory(req, res) {
    // const page = req.query.page || 1;
    // const limit = 10; // מספר מוצרים לכל דף
    // const skip = (page - 1) * limit; // חישוב כמות המוצרים שיש לדלג עליהם
    // const category = req.query.category;
    // const { category } = req.params
    const {category} = req.body
    try {
        const products = await productModel.find({ categories: category })
        // .skip(skip).limit(limit);
        res.json({ products })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}

export async function getProduct(req, res) {
    try {
        let { id } = req.params;
        let data = await productModel.findById(id)
        if (!data) {
            return res.status(404).json({
                title: "can`t get by id",
                message: "no product with such id" + id
            })
        }
        res.json({ data })
    }
    catch (e) {
        res.status("400").json({
            title: "not found",
            message: e.message
        })
    }
}

export async function addProduct(req, res) {
    let { body } = req;
    const validate = validateSchema.validate(body)
    if (validate.error) {
        return res.status(400).json(validate.error.details[0].message)
    }
    let newProduct = new productModel(body);
    try {
        await newProduct.save();
        res.json(newProduct);
    }
    catch (e) {
        res.status(400).json({ title: "adding new product faild", message: e.message });
    }
}


export async function deleteProduct(req, res) {
    let { id } = req.params;

    try {
        let product = await productModel.findByIdAndDelete(id)
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

export async function updateProduct(req, res) {

    let { id } = req.params;
    let { body } = req;


    if (body.name?.length > 0 && body.name.length < 3) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product name is too short",
        });
    }

    if (body.price && body.price < 0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product price is too low",
        });
    }

    if (body.stock && body.stock < 0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product stock is too low",
        });
    }
    /////////////////////////////////////////
    if (body.name?.length == 0)
        delete body.name;
    if (body.description?.length == 0)
        delete body.description;
    if (body.stock?.length == 0)
        delete body.stock;
    if (body.price?.length == 0)
        delete body.price;
    if (body.categories.length == 0)
        delete body.categories;
    if (body.sizes?.length == 0)
        delete body.sizes;
    if (body.color.length == 0)
        delete body.color;
    if (body.tag.length == 0)
        delete body.tag;

    console.log("body before update: " + body);

    //////////////////////////////////////////
    try {
        let data = await productModel.findByIdAndUpdate(id, body, { new: true })
        if (!data) {
            return res.status("404").json({
                title: "not found",
                message: "no product with such id" + id
            })
        }
        res.json(data)
    }
    catch (e) {
        res.status("400").json(
            {
                title: "could not update",
                message: e.message
            })
    }
}

export async function getTotalPages(req, res) {
    try {
        const totalProducts = await productModel.countDocuments(); // סופרת את כל המוצרים
        const totalPages = Math.ceil(totalProducts / 9); // סך כל הדפים
        res.json({ totalPages });
    }

    catch (e) {
        res.json({
            title: "failed",
            message: e.message
        })
    }
}

export async function searchProduct(req, res) {
    const {query} = req.query;
    if (!query) {
        try {
            const products = await productModel.find().skip(skip).limit(limit);
            res.json({ products })
        }
        catch (e) {
            res.status(400).json({
                title: "can`t get all",
                messege: e.message
            })
        }
    }
    else {
        try {
            const products = await productModel.find({ 
                name: { $regex: query, $options: "i" }  // חיפוש לא רגיש לרישיות
            });
    
            res.json({ products });
        }
        catch (e) {
            res.status(500).json({ message: e.message });

        }
    }
}    