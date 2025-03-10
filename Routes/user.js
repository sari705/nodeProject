import { Router } from "express";
import passport from "passport";
import { getAllUsers, logIn, signUp, updateUser, updatePassword, getUser, googleAuth } from "../Controllers/user.js";
import { checkManager, checkMiddlware } from "../middlewares/IdTest.js";

const router = Router()

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/me", async (req, res) => {
    // 🔹 חילוץ הטוקן מה-Header
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // 🔹 אימות ופענוח הטוקן
        const decoded = jwt.verify(token, "baby");

        // 🔹 שליפת המשתמש מהדאטהבייס
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token", error });
    }
});

router.get("/", checkManager, getAllUsers)
router.get("/:id", getUser)

router.put("/:id", checkMiddlware, updateUser)
router.put("/", updatePassword)

router.post("/", signUp)
router.post("/login", logIn)

// **נתיבים להתחברות דרך גוגל**

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    googleAuth);


export default router