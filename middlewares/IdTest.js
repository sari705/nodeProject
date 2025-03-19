import jwt from "jsonwebtoken";

export function checkMiddlware(req, res, next) {
    let token = req.headers.authorization;////מה שמגיע בבקשה ב haeders
    console.log("token in check: ", token);

    if (!token || !token.startsWith("Bearer "))
        return res.status(401).json({
            title: "משתמש לא מזוהה", message: "עליך לבצע כניסה"
        });
    token = token.split(" ")[1];
    try {
        let result = jwt.verify(token, process.env.JWT_SECRET)
        console.log(result);
        req.user = result;
        next();

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ title: "משתמש לא מזוהה", message: "עליך לבצע כניסה קודם" });

    }
}

export function checkManager(req, res, next) {

    let token = req.headers.authorization;
    console.log(token);

    if (!token || !token.startsWith("Bearer "))
        return res.status(401).json({
            title: "משתמש לא מזוהה",
            message: "עליך לבצע כניסה קודם"
        });

    token = token.split(" ")[1];
    console.log("token: ", token);

    try {
        let result = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", result);
        console.log("role: ", result.role);

        if (result.role == "MANAGER") {
            req.user = result;
            return next();
        }
        return res.status(403).json({
            title: "forbidden",
            message: "אינך מורשה לפעולה זו"
        })
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({
            title: " משתמש לא מזוהה או שהמשתמש אינו בתוקף ",
            message: "עליך לבצע כניסה"
        });
    }
}

