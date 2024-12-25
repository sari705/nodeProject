import {Schema, model } from "mongoose"
import Categories from "../utils/categories"
import TagsEnum from "../utils/tags"


const productSchema = Schema({
    name: String,
    description: String,
    images: { type: [String], default: [] },
    stock: Number,
    price: Number,
    categories:[Categories],
    sizes:[String],
    colors:[String],
    tag:TagsEnum
})

export const productModel = model("product", productSchema)