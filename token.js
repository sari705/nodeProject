import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const token = jwt.sign({ userId: user._id, userName: user.username, role: user.role },

        process.env.JWT_SECRET, { expiresIn: "1 day" });
    return token;
}
