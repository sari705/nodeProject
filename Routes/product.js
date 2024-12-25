import { Router } from "express";

import { addProduct, deleteProduct,getAllProducts, getProduct, updateProduct } from "../Controllers/product.js"


const router = Router()
router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)
router.post("/", addProduct)

export default router