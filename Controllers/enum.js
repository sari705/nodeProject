import Categories from "../utils/categories.js"
import TagsEnum from "../utils/tags.js"

export async function getCategiriesEnum(){
    return Categories;
}
export async function getTagsEnum(){
    return TagsEnum;
}