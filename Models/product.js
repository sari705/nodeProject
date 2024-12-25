import { Schema, model } from "mongoose"
import Categories from "../utils/categories.js"
import TagsEnum from "../utils/tags.js"


const productSchema = Schema({
    name: String,
    description: String,
    images: { type: [String], default: [] },
    stock: Number,
    price: Number,
    categories: {
        type: [String],
        enum: Object.keys(Categories) // הגדרה כ-enum מתוך הערכים של Categories
    },
    sizes: [String],
    colors: [String],
    tag: {
        type: String,
        enum: TagsEnum // הגדרה כ-enum מתוך TagsEnum
    }
})

export const productModel = model("product", productSchema)