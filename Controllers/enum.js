import Categories from "../utils/categories.js"
import TagsEnum from "../utils/tags.js"

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
export async function getTagsEnum(){
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