import { productModel } from "../Models/product.js";

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find()
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
    let isErr = false;
    let err;
    if (!body.name) {
        err += "name, ";
        isErr = true;
    }

    if (!body.price) {
        err += "price, ";
        isErr = true;
    }

    if (!body.description) {
        err += "description, ";
        isErr = true;
    }

    if (!body.images) {
        err += "images, ";
        isErr = true;
    }

    if (!body.stock) {
        err += "stock, ";
        isErr = true;
    }

    if (!body.tag) {
        err += "tag, ";
        isErr = true;
    }

    if (!body.categories) {
        err += "categories ";
        isErr = true;
    }

    if (isErr) {
        return res.status(404).json({
            title: "missing detailes",
            message: err + "required",
        });
    }

    if (body.name.length < 3) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product name is too short",
        });
    }

    if (body.price<0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product price is too low",
        });
    }

    if (body.stock<0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product stock is too low",
        });
    }

    if (!body.categories.length) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product categories is empty",
        });
    }

    if (!body.images.length) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product images is empty",
        });
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
    

    if (body.name?.length >0&&body.name.length <3) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product name is too short",
        });
    }

    if (body.price&&body.price<0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product price is too low",
        });
    }

    if (body.stock&&body.stock<0) {
        return res.status(400).json({
            title: "detailes are not correct",
            message: "the product stock is too low",
        });
    }
/////////////////////////////////////////
    if(body.name?.length == 0)
        delete body.name;
    if(body.description?.length == 0)
        delete body.description;
    if(body.stock?.length == 0)
        delete body.stock;
    if(body.price?.length == 0)
        delete body.price;
    if(body.categories.type?.length == 0 && body.categories.enum == 0)
        delete body.categories;

    if(body.sizes?.length == 0)
        delete body.sizes;
    else{
        let change = false;
        for (let i = 0; i < body.sizes.length && !change; i++) {
            change = body.sizes[i].length != 0;
        }
        if(!change)
            delete body.sizes;
    }

    if(body.colors&&Array.isArray(body.colors) && body.colors.length == 0)
        delete body.colors;
    else{
        let colChange = false;
        for (let i = 0; i < body.colors.length && !colChange; i++) {
            colChange = body.colors[i].length != 0;
        }
        if(!colChange)
            delete body.colors;
    }

    if(body.tag.type?.length == 0 && body.tag.enum?.length == 0)
        delete body.tag;
    
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