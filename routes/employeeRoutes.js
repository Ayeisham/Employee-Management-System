const express = require("express");

const authenticateToken = require("../middlewares/auth"); //JWT
const Validators = require("../middlewares/validate"); //middleware validation function to pass schemas
const AdminAuth = require("../middlewares/adminAuth"); //only admin  can access

const { createEmployeeSchema } = require("../constants/employeeSchema"); //schemas to be passed to validators
const { signInSchema } = require("../constants/signInSchema");
const { logAttendanceSchema } = require("../constants/attendancesSchema");
const { applyLeaveSchema } = require("../constants/leaveSchema");

const EmployeeController = require("../controllers/employeeController");
const router = express.Router();

router.get("/getemployees", EmployeeController.getEmployees);

router.post(
  "/signup",
  (req, res, next) => console.log(req.body) || next(),
  Validators(createEmployeeSchema),
  EmployeeController.registerEmployee,
);
router.post("/signin", Validators(signInSchema), EmployeeController.login);
router.post(
  "/markAttendance",
  authenticateToken,
  Validators(logAttendanceSchema),
  EmployeeController.record,
);
router.post(
  "/requestleave",
  authenticateToken,
  Validators(applyLeaveSchema),
  EmployeeController.applyForLeave,
);
router.get("/myList", authenticateToken, EmployeeController.leavesList);

router.get(
  "/manager/:manager_id/attendance",
  authenticateToken,
  EmployeeController.getTeamByManager,
);
router.get(
  "/leaveRecord",
  authenticateToken,
  EmployeeController.getLeavesByManager,
);
router.patch(
  "/leave-request/:leaveId",
  authenticateToken,
  EmployeeController.updateLeaveStatus,
);

// router.post(
//   "/admin/create-manager",(req, res, next) => console.log(req.body) || next(),
 
//   authenticateToken,
//   AdminAuth,
//   EmployeeController.assignTeam,
// );

router.post("/forgot-password", EmployeeController.forgotPassword);
router.post("/reset_password/:token", EmployeeController.resetPassword);

module.exports = router;
