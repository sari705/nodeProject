import { Router } from "express";

import { addProduct, deleteProduct,getAllProducts, getProduct, updateProduct, getTotalPages, getProductsByCategory, searchProduct } from "../Controllers/product.js"


const router = Router()
router.get("/", getAllProducts)
router.get("/pages", getTotalPages)
router.get("/search", searchProduct )
router.get("/:id", getProduct)
router.post("/category", getProductsByCategory)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)
router.post("/", addProduct)

export default router