const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("registration_db", "root", "admin", {
  host: "localhost",
  logging: false,
  dialect: "mysql", // or postgres
});

sequelize
  .authenticate()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err));

module.exports = sequelize;
