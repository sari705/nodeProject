import { title } from "process";
import { userModel } from "../Models/user.js";
import { forEach, pick } from "lodash"

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
    if (!body.password || !body.username) {
        return res.status(401).json({ title: "missing", message: "name and password are required" })
    }
    try {
        let data = await userModel.findOne({ username: body.username, password: body.password })
        if (!data) {
            return res.status(404).json({
                title: "no such details",
                message: "log in failed"
            })
        }
        res.json({ data })
    }
    catch (e) {
        res.status("500").json({
            title: "server error",
            message: e.message
        })
    }
}

export async function signUp(req, res) {
    let { body } = req
    if (!body.username || !body.password || !body.email || !body.phone) {
        return res.status("404").json({
            title: "missing detailes",
            message: "name and phone are required"
        })
    }

    try {
        let newUser = new userModel(body)
        await newUser.save()
        return res.json(newUser)
    }
    catch (e) {
        res.status("400").json({ title: "cannot add", message: e.message })
    }
}

export async function updateUser(req, res) {
    let { id } = req.params;
    let { body } = req;
    const allowedFields = ['username', 'role', 'email'];
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
        res.json(data)
    }
    catch (e) {
        res.status("400").json(
            {
                title: "could not update",
                message: e.message
            })
    }
}

export async function updatePassword(req, res) {
    let { id } = req.params;
    let { password } = req.body;
    try {
        let data = await userModel.findByIdAndUpdate(id, { $set: { password } }, { new: true })
        if (!data) {
            return res.status(404).json({
                title: "not found",
                message: "no user with such id " + id
            })
        }
        res.json(data)
    }
    catch (e) {
        res.status("400").json(
            {
                title: "could not update",
                message: e.message
            })
    }
}