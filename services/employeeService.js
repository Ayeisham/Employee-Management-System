const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");
// const { date } = require("joi");
const EmployeeRepository = require("../repositories/employeeRepositories");
const Employee = require("../models/employeeModel");

const EmployeeService = {
  getEmployees: async () => {
    const employees = await EmployeeRepository.getEmployeeDropdown();
    return employees;
  },
  registerEmployee: async (data) => {
    const {
      employee_id,
      email,
      first_name,
      last_name,
      father_name,
      cnic,
      dob,
      address,
      salary,
      department_id,
      manager_id,
      password,
      role,
    } = data;

    //checking if employee already exists
    const existing = await EmployeeRepository.findEmployeeById(employee_id);
    if (existing) {
      throw new Error("Employee Already exists");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    return await EmployeeRepository.createEmployee({
      employee_id,
      email,
      first_name,
      last_name,
      father_name,
      cnic,
      dob,
      address,
      salary,
      department_id,
      manager_id,
      password,
      role,
    });
  },
  loginUser: async (email, password) => {
    const employee = await EmployeeRepository.findEmployeeByEmail(email);
    if (!email) {
      throw new Error("INVALID EMAIL");
    }
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      throw new Error("INVALID PASSWORD");
    }

    const token = jwt.sign(
      {
        employee_id: employee.employee_id,
        email: employee.email,
        department_id: employee.department_id,
        manager_id: employee.manager_id,
        role: employee.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 4️⃣ Return response (never return password)
    return {
      token,
      user: {
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        role: employee.role,
      },
    };
  },
  putAttendance: async (employee_id, type) => {
    if (!employee_id || !type) throw new Error("MISSING_FIELDS");

    // check if employee exists
    const employee = await EmployeeRepository.findEmployeeById(employee_id);
    if (!employee) throw new Error("EMPLOYEE_NOT_FOUND");

    // generate date & time
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 8); // HH:MM:SS

    // check previous attendance
    const records = await EmployeeRepository.checkAttendance(employee_id, date);
    const hasCheckIn = records.some((r) => r.type === "checkIn");
    const hasCheckOut = records.some((r) => r.type === "checkOut");

    if (type === "checkIn" && hasCheckIn) throw new Error("ALREADY_CHECKED_IN");
    if (type === "checkOut" && !hasCheckIn) throw new Error("CHECKIN_REQUIRED");
    if (type === "checkOut" && hasCheckOut)
      throw new Error("ALREADY_CHECKED_OUT");

    // insert attendance
    await EmployeeRepository.putAttendance({ employee_id, type, date, time });
    return `Successfully ${type} recorded`;
  },
  getTeamByManager: async (manager_id) => {
    if (!manager_id) throw new Error("MISSING_MANAGER_ID");

    // fetch all attendance records for employees under this manager
    const records = await EmployeeRepository.getTeamAttendance(manager_id);

    // group by employee
    const employeeMap = {};

    return records.map((r) => ({
      employee_id: r.employee.employee_id,
      first_name: r.employee.first_name,
      last_name: r.employee.last_name,
      department_name: r.employee.department.department_name,
      checkIn_time: r.type === "checkIn" ? r.time : "-",
      checkOut_time: r.type === "checkOut" ? r.time : "-",
      attendance_date: r.date,
    }));
    return Object.values(employeeMap);
  },
  applyForLeave: async (leaveData) => {
    const { employee_id, start_date, end_date, leave_type } = leaveData;
    if (!start_date || !end_date || !leave_type) {
      throw { status: 400, message: "Missing Fields" };
    }
    if (new Date(start_date) > new Date(end_date)) {
      throw new Error("INVALID_DATE_RANGE");
    }

    const result = await EmployeeRepository.createLeaveRequest(leaveData);
    return result;
  },
  getMyLeaves: async (employee_id) => {
    if (!employee_id) {
      throw new Error("Employee Id is missing");
    }
    return await EmployeeRepository.getMyLeavesList(employee_id);
  },

  getLeavesByManager: async (manager_id) => {
    try {
      if (!manager_id) {
        throw new Error("Missing MANAGER_ID");
      }
      return await EmployeeRepository.getAllLeavesByManager(manager_id);
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  updateLeaveStatus: async (leave_id, status) => {
    if (!leave_id || !status) {
      throw new Error("MISSING_FIELDS");
    }

    if (!["Approved", "Rejected"].includes(status)) {
      throw new Error("INVALID_STATUS");
    }

    const updated = await EmployeeRepository.updateLeaveStatus(
      leave_id,
      status,
    );

    if (updated === 0) {
      throw new Error("LEAVE_NOT_FOUND");
    }

    return "Leave status updated successfully";
  },

  // assignManagerToEmployee: async (employeeIds, manager_id) => {
  //   if (!Array.isArray(employeeIds || employeeIds.length === 0)) {
  //     throw new Error("Employees are required");
  //   }

  //   if (!manager_id) {
  //     throw new Error("Manager Id is required");
  //   }

  //   const manager = await EmployeeRepository.findEmployeeById(manager_id);
  //   console.log("Manager found:", manager?.employee_id, manager?.role);
  //   if (!manager) {
  //     throw new Error("Manager is missing");
  //   }

  //   if (manager.role !== "Manager") {
  //     await EmployeeRepository.promoteToManager(manager_id);
  //   }
  //   const [updatedCount] = await EmployeeRepository.assignEmployeeToManager(
  //     employeeIds,
  //     manager_id,
  //   );
  //   console.log("updated count ", updatedCount);

  //   console.log("🔥 SERVICE STARTED");
  //   console.log("manager_id:", manager_id);
  //   console.log("employeeIds:", employeeIds);
  //   return {
  //     manager_id,
  //     assigned_employee: employeeIds,
  //     updated_count: updatedCount,
  //   };
  // },

  forgotPassword: async (email) => {
    const user = await EmployeeRepository.findEmployeeByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = Date.now() + 15 * 60 * 1000;

    await EmployeeRepository.updateResetToken(user.id, hashedToken, expiresAt);

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await sendResetPasswordEmail(user.email, resetLink);

    return { message: "Password reset link sent" };
  },

  resetPassword: async (token, new_password) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await EmployeeRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new Error("Invalid or expire token");
    }

    if (user.reset_password_expires < Date.now()) {
      throw new Error("TOKEN_EXPIRED");
    }
    console.log("New PASSWORD :"  , new_password);
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await EmployeeRepository.updatePassword(user.id, hashedPassword);
    return { message: "Password reset successful" };
  },
};

module.exports = EmployeeService;
