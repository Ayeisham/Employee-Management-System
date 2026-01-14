
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "registration_db",
  "root",
  "admin",
  {
    host: "localhost",
    logging: false,
    dialect: "mysql" // or postgres
  }
);

// this is used to drop or alter the tables in the database it is optional to be used.
// sequelize.sync({ alter: true })
// .then(() => console.log("Tables synced"));
sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error:", err));


module.exports = sequelize;