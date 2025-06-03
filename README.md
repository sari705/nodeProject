# nodeProject

מערכת ניהול מוצרים מבוססת Node.js ו-Express.js

## תיאור כללי

פרויקט זה הוא שרת לניהול קטלוג מוצרים, הכולל תמיכה בעדכון, מחיקה, הוספה ושליפה של מוצרים ממסד הנתונים. המערכת פותחה בסביבת Express וכוללת טיפול בשדות כמו צבעים, מידות, תגיות, קטגוריות ועוד.

המערכת תומכת בהרשמה דרך Google OAuth.

## טכנולוגיות

* Node.js
* Express.js
* MongoDB (באמצעות Mongoose)
* Google OAuth 2.0

## התקנה מקומית

```bash
# שכפול הריפוזיטורי
git clone https://github.com/sari705/nodeProject.git
cd nodeProject

# התקנת התלויות
npm install

# הרצת השרת
node server.js
```

## קונפיגורציה

יש להשתמש בקובץ `.env` (אם נדרש) עם ההגדרות הבאות:

```env
PORT=10000
MONGO_URL=<your_mongodb_connection_string>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
SESSION_SECRET=<your_session_secret>
CLIENT_URL=https://your-client-url.com
```

## מסלולים עיקריים (Routes)

* `GET /products` - שליפת רשימת מוצרים
* `POST /products` - הוספת מוצר חדש
* `PUT /products/:id` - עדכון מוצר קיים
* `DELETE /products/:id` - מחיקת מוצר
* `GET /auth/google` - התחברות עם גוגל
* `GET /auth/google/callback` - נקודת חזרה אחרי אישור בגוגל

## ולידציה ועדכונים חכמים

* המערכת בודקת את אורך שם המוצר.
* מחירים ומלאי לא יכולים להיות שליליים.
* שדות ריקים נמחקים אוטומטית מהבקשה לפני עדכון.
* בודקת אם יש שינויים ממשיים בצבעים/מידות לפני שליחה.

## ניהול שגיאות

המערכת מחזירה תשובות מתאימות (404/400) בהתאם למצב.


