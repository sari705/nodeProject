import { Router } from "express";

import { getAllUsers, logIn, signUp, updateUser, updatePassword, getUser } from "../Controllers/user.js";
import { checkManager, checkMiddlware } from "../middlewares/IdTest.js";

const router = Router()
router.get("/", checkManager, getAllUsers)
router.get("/:id", getUser)

router.put("/:id", checkMiddlware, updateUser)
router.put("/", updatePassword)

router.post("/", signUp)
router.post("/login", logIn)

export default router