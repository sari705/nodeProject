import jwt from "jsonwebtoken";

export const generateToken = (user) =>{
    const token = jwt.sign({userId: user._id, userName: user.username, role: user.role},
        //  process.env.SECRET_KEY
        "baby" , {expiresIn: "1 day"});
         return token;
}
// SECRET_KEY  environment variable