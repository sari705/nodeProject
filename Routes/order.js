import { Router } from "express";

import { addOrder, deleteOrder, getAllOrders, getOrderByUser, updateOrder } from "../Controllers/order.js"


const router = Router()
router.get("/", getAllOrders)
router.get("/:id", getOrderByUser)

router.delete("/:id", deleteOrder)

router.put("/:id", updateOrder)
router.post("/", addOrder)

export default router