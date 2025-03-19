import { Router } from "express";
import { addOrder, deleteOrder, getAllOrders, getOrderByUser, updateOrder } from "../Controllers/order.js"
import { checkManager, checkMiddlware } from "../middlewares/IdTest.js";

const router = Router()
router.get("/", checkManager, getAllOrders)
router.get("/:id", checkMiddlware, getOrderByUser)
router.delete("/:id", checkManager, deleteOrder)
router.put("/:id", updateOrder)
router.post("/", addOrder)

export default router;