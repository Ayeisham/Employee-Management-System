const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // your MySQL username
    password: "admin", // your MySQL password
    database: "registration_db"
});

db.connect(err => {
    if (err) return console.error("MySQL connection error:", err);
    console.log("Connected to MySQL database");
});

module.exports = db;
