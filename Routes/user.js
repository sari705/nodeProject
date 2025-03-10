import { Router } from "express";

import { getAllUsers, logIn, signUp, updateUser, updatePassword, getUser, googleAuth } from "../Controllers/user.js";
import { checkManager, checkMiddlware } from "../middlewares/IdTest.js";

const router = Router()
router.get("/", checkManager, getAllUsers)
router.get("/:id", getUser)

router.put("/:id", checkMiddlware, updateUser)
router.put("/", updatePassword)

router.post("/", signUp)
router.post("/login", logIn)

// **נתיבים להתחברות דרך גוגל**
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

export default router