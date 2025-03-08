import jwt from "jsonwebtoken";

export function checkMiddlware(req, res, next) {
    token = req.headers.authorization;////מה שמגיע בבקשה ב haeders
    if (!token)
        return res.status(401).json({
            title: "משתמש לא מזוהה", message: "עליך לבצע כניסה"
        });
    token = token.split(" ")[1];
    try {
        let result = jwt.verify(token, "baby"
            //  process.env.SECRET_KEY
        )
        console.log(result);
        next();

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ title: "משתמש לא מזוהה", message: "עליך לבצע כניסה קודם" });

    }
}

export function checkManager(req, res, next) {

    let token = req.headers.Authorization;
    if (!token)
        return res.status(401).json({ title: "משתמש לא מזוהה", message: "עליך לבצע כניסה קודם" });
    token = token.split(" ")[1];
    console.log("token: ", token);

    try {
        let result = jwt.verify(token, "baby"
            //  process.env.SECRET_KEY
        )
        console.log("Decoded JWT:", result);
        console.log("role: ", result.role);
        if (result.role == "MANAGER") {
            return next();
        }
        return res.status(403).json({ title: "forbidden", message: "אינך מורשה לפעולה זו" })
    }
    catch (err) {
        console.log(err);

        return res.status(401).json({ title: " משתמש לא מזוהה או שהמשתמש אינו בתוקף ", message: "עליך לבצע כניסה" });
    }
}

