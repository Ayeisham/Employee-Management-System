const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.get("/", (req, res) => res.send("Server is running"));
app.use("/departments", departmentRoutes);
app.use("/employee", employeeRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
