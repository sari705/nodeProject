import { Router } from "express";
import passport from "passport";
import { getAllUsers, logIn, signUp, updateUser, updatePassword, getUser, googleAuth, getUserByToken } from "../Controllers/user.js";
import { checkManager, checkMiddlware } from "../middlewares/IdTest.js";

const router = Router()

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/me", getUserByToken);
router.get("/", checkManager, getAllUsers)
router.get("/:id", getUser)
router.put("/:id", checkMiddlware, updateUser)
router.put("/", updatePassword)
router.post("/", signUp)
router.post("/login", logIn)
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleAuth);

export default router