import { Router } from "express";

import { checkManager } from "../middlewares/IdTest.js";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct, getTotalPages, getProductsByCategory, searchProduct } from "../Controllers/product.js"


const router = Router()

router.get("/", getAllProducts)
router.get("/pages", getTotalPages)
router.get("/search", searchProduct)
router.get("/:id", getProduct)
router.delete("/:id", checkManager, deleteProduct)
router.put("/:id", checkManager, updateProduct)
router.post("/", checkManager, addProduct)

router.post("/category", getProductsByCategory)

export default router;