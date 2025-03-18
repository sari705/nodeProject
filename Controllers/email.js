import mailgun from "mailgun-js";

const DOMAIN = "sandbox554687012f354998a733bf5c7249a1e0.mailgun.org"; // שימי כאן את הדומיין שאישרת ב-Mailgun
const mg = mailgun({ apiKey: "088f922e1fa469bdfee2c99ddaa88e983d4b3a2aeb973dc1", domain: DOMAIN });

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