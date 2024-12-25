import { appendFile } from "fs/promises";

export function logToFile(req, res, next) {
    console.log("in");
    appendFile("./log1.txt", `\n${new Date().toLocaleDateString()}---> ${req.method} ${req.url}`)
    next();
}
