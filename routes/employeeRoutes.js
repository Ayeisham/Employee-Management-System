const express = require("express");
const authenticateToken = require("../middlewares/auth");

const EmployeeController = require("../controllers/employeeController");
const CreateEmployeeSchema = require("../middlewares/schemajoi");
const { createEmployeeSchema } = require("../constants/employeeSchema");
const { leaveRequestSchema } = require("../constants/leaveSchema");

const router = express.Router();

router.get("/getemployees", EmployeeController.getEmployees);

router.post(
  "/signup",
  CreateEmployeeSchema(createEmployeeSchema),
  EmployeeController.registerEmployee
);
router.post("/signin", EmployeeController.login);
router.post("/markAttendance", authenticateToken, EmployeeController.record);
router.post(
  "/requestleave",
  authenticateToken,
  EmployeeController.applyForLeave
);
router.get("/myList", authenticateToken, EmployeeController.leavesList);

router.get(
  "/manager/:manager_id/attendance",
  authenticateToken,
  EmployeeController.getTeamByManager
);
router.get(
  "/leaveRecord",
  authenticateToken,
  EmployeeController.getLeavesByManager
);
router.patch(
  "/leave-request/:leaveId",
  authenticateToken,
  EmployeeController.updateLeaveStatus
);

module.exports = router;
