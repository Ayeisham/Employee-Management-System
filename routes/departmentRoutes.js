const express = require("express");
const DepartmentController = require("../controllers/departmentController");

const router = express.Router();

router.get("/getdepartments", DepartmentController.getDepartments);

module.exports = router;
