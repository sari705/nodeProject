import { Router } from "express";

import {getAllUsers, logIn, signUp, updateUser, updatePassword, getUser} from "../Controllers/user.js";

const router = Router()
router.get("/", getAllUsers)
router.get("/:id", getUser)

router.put("/:id", updateUser)
router.put("/", updatePassword)

router.post("/", signUp)
router.post("/login", logIn)

export default router