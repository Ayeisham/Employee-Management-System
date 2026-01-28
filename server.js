const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const sequelize = require("./config/database");
// const createAdmin = require("./seeders/createAdmin");

// const {
//   Employeez,
//   dailyAttendance,
//   dpartment,
//   Leavez,
// } = require("./models/associations");

const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.get("/", (req, res) => res.send("Server is running"));
app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(__dirname, "reset_password.html"));
});
app.use("/departments", departmentRoutes);
app.use("/employee", employeeRoutes);

(async () => {
  try {
    await sequelize.sync();
    console.log("DB synced");

    // await createAdmin();

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("DB sync failed:", error);
  }
})();
