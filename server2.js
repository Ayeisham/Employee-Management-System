const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const registerRoutes = require('./routes/registerRoutes');
const signInRoutes = require ('./routes/signInRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.get("/", (req, res) => res.send("Server is running"));

app.use("/", departmentRoutes);
app.use("/", employeeRoutes);
app.use("/", registerRoutes);
app.use("/auth", signInRoutes);
app.use("/attendance", attendanceRoutes);

module.exports = app;
