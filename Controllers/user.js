import { userModel } from "../Models/user.js";
import { generateToken } from "../token.js";
import lodash from "lodash";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from 'bcrypt';
import { isValidObjectId } from "mongoose";


export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find()
        const usersWithoutPassword = users.map(user => lodash.omit(user.toObject(), ["password"]))
        res.json({ usersWithoutPassword })
    }
    catch (e) {
        res.status(400).json({
            title: "can`t get all",
            messege: e.message
        })
    }
}

export async function getUser(req, res) {
    try {
        let { id } = req.params;
        let user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                title: "can`t get by id",
                message: "no user with such id" + id
            })
        }
        const userWithoutPassword = lodash.omit(user.toObject(), ['password']);
        res.json({ userWithoutPassword })
    }
    catch (e) {
        res.status("500").json({
            title: "server error",
            message: e.message
        })
    }
}

export async function logIn(req, res) {
    let { body } = req;
    if (!body.password || !body.email) {
        return res.status(401).json({ title: "missing", message: "email and password are required" })
    }
    //bcript אין צורך לבדוק עם הביטוי הרגולרי כי כבר בודקים עם 

    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{7,15}$/; // לפחות 7 תווים, כולל אותיות ומספרים

    // if (!passwordRegex.test(body.password)) {
    //     return res.status(400).json({
    //         title: "valid password",
    //         message: "not a strong password, please enter a password with letters, numbers and between 7-15 characters",
    //     });
    // }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // email format
    if (!emailRegex.test(body.email)) {
        return res.status(400).json({
            title: "invalid email",
            message: "invalid email, please enter correct email",
        });
    }

    try {
        let data = await userModel.findOne({ email: body.email, password: body.password });

        if (!data) {
            return res.status(404).json({
                title: "no such details",
                message: "log in failed"
            });
        }
        //יש בעיה שיש כבר משתמשים עם סיסמאות לא מוצפנות
        // bcrypt.compare(body.password, data.password, (err, result) => {
        //     if (err) {
        //         console.log("Error comparing passwords:", err);
        //         return res.status(401).json({ title: "Error comparing passwords", message: err.message });
        //     }
        //     if (result) {
        //         console.log("Password is correct!");
        //         // אפשר להתחבר
        //     } else {
        //         console.log("Incorrect password!");
        //         return res.status(401).json({ title: " Incorrect password" });
        //     }
        // });


        let dataWithoutPassword = lodash.omit(data.toObject(), ["password"]);
        const token = generateToken(dataWithoutPassword);

        res.setHeader("Authorization", `Bearer ${token}`);

        // החזרת הנתונים והטוקן בתגובה
        res.json({ data: dataWithoutPassword, token });
    }
    catch (e) {
        res.status(500).json({
            title: "server error",
            message: e.message
        });
    }

}


export async function signUp(req, res) {
    let { body } = req;

    if (!body.username || !body.password || !body.email) {
        return res.status("404").json({
            title: "missing detailes",
            message: "name password and email are required"
        })
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{7,15}$/; // לפחות 7 תווים, כולל אותיות ומספרים
    if (!passwordRegex.test(body.password)) {
        return res.status(400).json({
            title: "valid password",
            message: "not a strong password, please enter a password with letters and numbers between 7-15 characters",
        });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // email format
    if (!emailRegex.test(body.email)) {
        return res.status(400).json({
            title: "invalid email",
            message: "invalid email, please enter correct email",
        });
    }
    //כאן יש בעיה כי כבר שמורים לי משתמשים עם ססמאות לא מוצפנות
    // bcrypt.hash(body.password, 10, (err, hash) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(500).json({ title: "bcript function faild", message: err.message });
    //     }
    //     if (hash) {
    //         body.password = hash;
    //         console.log("hashed password", hash);
    //     }
    //     else {
    //         console.log(hash);
    //     }
    // })

    try {
        let users = await userModel.find({ email: body.email })
        if (users.length > 0) {
            return res.status("400").json({
                title: "log in",
                message: "there is user with this details"
            })
        }
    }
    catch (e) {
        return res.status("400").json({
            title: "server error",
            message: "could not check for validation"
        })
    }

    try {
        let newUser = new userModel({ ...body, role: "USER" });
        console.log("newUser: ", newUser);
        await newUser.save();
        delete newUser.password;
        const token = generateToken(newUser);
        res.setHeader("Authorization", `Bearer ${token}`);

        // החזרת הנתונים והטוקן בתגובה
        return res.json({ user: newUser, token })
    }
    catch (e) {
        res.status("400").json({ title: "cannot add", message: e.message })
    }
}

export async function updateUser(req, res) {
    let { id } = req.params;
    let { body } = req;
    const allowedFields = ['username', 'email'];
    body = lodash.pick(body, allowedFields)
    if (Object.keys(body).length === 0) {
        return res.status(400).json({
            title: "Validation Error",
            message: "No valid fields provided for update"
        });
    }
    try {
        let data = await userModel.findByIdAndUpdate(id, body, { new: true })

        if (!data) {
            return res.status(404).json({
                title: "not found",
                message: "no user with such id " + id
            })
        }
        let dataWithoutPassword = lodash.omit(data.toObject(), ["password"]);
        res.json({ dataWithoutPassword })
    }
    catch (e) {
        res.status("400").json(
            {
                title: "could not update",
                message: e.message
            }
        )
    }
}

export async function updatePassword(req, res) {
    let { id } = req.body;
    let { password } = req.body;
    try {
        if (!isValidObjectId(id))
            return res.status(400).json({
                title: "object id is not valid",
                message: "not in correct ObjectId format",
            });

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{7,15}$/; // לפחות 7 תווים, כולל אותיות ומספרים
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                title: "valid password",
                message: "not a strong password, please enter a password with letters, numbers and between 7-15 characters",
            });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ title: "bcript function faild", message: err.message });
            }
            if (hash) {
                password = hash;
                console.log("hashed password", hash);
            }
            else {
                console.log(hash);
            }
        })

        let data = await userModel.findByIdAndUpdate(id, { $set: { password } }, { new: true }).lean()
        if (!data) {
            return res.status(404).json({
                title: "not found",
                message: "no user with such id " + id
            })
        }
        delete data.password;
        res.json(data);
    }
    catch (e) {
        res.status("400").json(
            {
                title: "could not update",
                message: e.message
            })
    }
}

export function googleAuth(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const token = generateToken({
        _id: req.user.id,
        username: req.user.username,
        role: req.user.role,
    })
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
}

export async function getUserByToken(req, res) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    }
    catch (error) {
        console.error("Token verification failed:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired. Please log in again." });
        }

        res.status(401).json({ message: "Invalid token", error });
    }
}