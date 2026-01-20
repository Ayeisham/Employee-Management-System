const EmployeeService = require("../services/employeeService");

const EmployeeController = {
  getEmployees: async (req, res) => {
    try {
      const employees = await EmployeeService.getEmployees();
      res.status(200).json(employees);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  registerEmployee: async (req, res) => {
    try {
      await EmployeeService.registerEmployee(req.body);
      res.status(201).send("Employee registered successfully");
    } catch (err) {
      if (err.message === "Employee Already exists") {
        return res.status(400).send("Employee ID existed already");
      }
      console.error(err);
      return res.status(500).send("Error saving employee");
    }
  },
  login: async (req, res) => {
    try {
      const { employee_id, password } = req.body;

      const result = await EmployeeService.loginUser(employee_id, password);

      res.json({
        message: "sign-in successful",
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      if (err.message === "INVALID EMPLOYEE_ID") {
        return res.status(400).json({ message: "Invalid employee Id" });
      }
      if (err.message === "INVALID PASSWORD") {
        return res.status(400).json({ message: "Password is invalid" });
      }

      return res.status(500).json({ message: "Server error" });
    }
  },
  record: async (req, res) => {
    try {
      const employee_id = req.user.employee_id;
      const { type } = req.body;

      const message = await EmployeeService.putAttendance(employee_id, type);
      res.json({ message });
    } catch (err) {
      console.error("CheckIn/Out Error:", err.message);

      const errorMap = {
        MISSING_FIELDS: [400, "Missing fields"],
        EMPLOYEE_NOT_FOUND: [404, "Employee not found"],
        ALREADY_CHECKED_IN: [400, "Already checked in today"],
        CHECKIN_REQUIRED: [400, "Cannot check out before check in"],
        ALREADY_CHECKED_OUT: [400, "Already checked out today"],
      };

      if (errorMap[err.message]) {
        const [status, msg] = errorMap[err.message];
        return res.status(status).send(msg);
      }

      return res.status(500).send("Server Error");
    }
  },
  getTeamByManager: async (req, res) => {
    try {
      const manager_id = req.params.manager_id;
      const employees = await EmployeeService.getTeamByManager(manager_id);
      res.json({ employees });
    } catch (err) {
      console.error("Error fetching team:", err.message);
      if (err.message === "MISSING_MANAGER_ID") {
        return res
          .status(400)
          .json({ success: false, message: "Manager ID required" });
      }
      res.status(500).json({ error: "Server error" });
    }
  },
  applyForLeave: async (req, res) => {
    try {
      const employee_id = req.user.employee_id;
      const { leave_type, start_date, end_date, reason } = req.body;
      await EmployeeService.applyForLeave({
        employee_id,
        leave_type,
        start_date,
        end_date,
        reason,
      });
      res.json({ message: "Leave request submitted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(err.status || 500)
        .json({ message: err.message || "server error" });
    }
  },
  leavesList: async (req, res) => {
    try {
      const employee_id = req.user.employee_id;
      const result = await EmployeeService.getMyLeaves(employee_id);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
  getLeavesByManager: async (req, res) => {
    try {
      if (req.user.role != "manager") {
        console.log("Access denied");
      }
      const manager_id = req.user.employee_id;
      const result = await EmployeeService.getLeavesByManager(manager_id);
      res.status(200).json(result);
    } catch (err) {
      console.log("Controller Error", err.message);
      if (err.message === "Missing MANAGER_ID") {
        return res.status(400).json({ message: "Manager is invalid" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  },
  updateLeaveStatus: async (req, res) => {
    try {
      if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied" });
      }

      const leave_id = req.params.leaveId;
      const { status } = req.body;

      await EmployeeService.updateLeaveStatus(leave_id, status);

      res.json({
        success: true,
        message: `Leave ${status} successfully`,
      });
    } catch (err) {
      console.error("controller Leave Error:", err.message);

      if (err.message === "INVALID_STATUS") {
        return res.status(400).json({ message: "Invalid status" });
      }

      if (err.message === "LEAVE_NOT_FOUND") {
        return res.status(404).json({ message: "Leave request not found" });
      }

      if (err.message === "MISSING_LEAVE_ID") {
        return res.status(400).json({ message: "Leave ID is missing" });
      }

      res.status(500).json({ message: "Server error" });
    }
  },
  createManager: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        father_name,
        cnic,
        dob,
        address,
        salary,
        employee_id,
        password,
        department_id,
      } = req.body;
      if (!password || password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      if (!employee_id) {
        return res.status(400).json({
          message: "employee_id is required",
        });
      }

      const existing = await Employee.findOne({
        where: { employee_id },
      });

      if (existing) {
        return res.status(409).json({
          message: "Employee already exists",
        });
      }

      const manager = await Employee.create({
        first_name,
        last_name,
        father_name,
        cnic,
        dob,
        address,
        salary,
        employee_id,
        password,
        department_id,
        manager_id: employee_id,
        role: "Manager",
      });

      return res.status(201).json({
        message: "Manager created successfully",
        manager,
      });
    } catch (error) {
      console.error("Create Manager Error:", error);

      return res.status(500).json({
        message: "Error creating manager",
        error: error.message,
      });
    }
  },
};

module.exports = EmployeeController;
