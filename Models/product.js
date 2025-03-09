import { Schema, model } from "mongoose"
import Categories from "../utils/categories.js"
import TagsEnum from "../utils/tags.js"
import Joi from "joi" 


const productSchema = Schema({
    name: String,
    description: String,
    images: { type: [String], default: [] },
    stock: Number,
    price: Number,
    categories: {
        type: String,
        enum: Categories // הגדרה כ-enum מתוך הערכים של Categories
    },
    sizes: [String],
    colors: [String],
    tag: {
        type: [String],
        enum: TagsEnum // הגדרה כ-enum מתוך TagsEnum
    }
})



export const validateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    stock: Joi.number().integer().min(1).required(),
    tag: Joi.array().items(Joi.string()).required(),
    categories: Joi.string().min(1).required()
});

export const productModel = model("product", productSchema)