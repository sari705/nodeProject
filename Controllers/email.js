import mailgun from "mailgun-js";

const DOMAIN = "your-domain.com"; // שימי כאן את הדומיין שאישרת ב-Mailgun
const mg = mailgun({ apiKey: "YOUR_MAILGUN_API_KEY", domain: DOMAIN });

export function sendEmail(to, subject, text) {
    const data = {
        from: "TinyDreams46@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.error("❌ שגיאה בשליחת המייל:", error);
        } else {
            console.log("📧 מייל נשלח בהצלחה:", body);
        }
    });
}


export function completeOrder(userEmail, orderDetails) {
    sendEmail(userEmail, "האישור להזמנה שלך", `שלום,\n\nהזמנתך הושלמה בהצלחה!\n\n${orderDetails}`);
}