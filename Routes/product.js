import { Router } from "express";

import { addProduct, deleteProduct,getAllProducts, getProduct, updateProduct, getTotalPages } from "../Controllers/product.js"
import { checkManager } from "../middlewares/IdTest.js";

const router = Router()
router.get("/", getAllProducts)
router.get("/pages", getTotalPages)
router.get("/:id", getProduct)
router.delete("/:id", checkManager, deleteProduct)
router.put("/:id",checkManager, updateProduct)
router.post("/", checkManager, addProduct)

export default router