import Categories from "../utils/categories.js"
import TagsEnum from "../utils/tags.js"
import Colors from "../utils/colors.js"

export async function getCategiriesEnum(req, res){
    try {            
            res.json({ Categories })
        }
        catch (e) {
            res.status(400).json({
                title: "can`t get all",
                messege: e.message
            })
        }


    return Categories;
}
export async function getTagsEnum(req, res){
    try {
        res.json({ TagsEnum })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}
export async function getColorsEnum(req, res){
    try {
        res.json({ Colors })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}