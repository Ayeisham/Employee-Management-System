const bcrypt = require("bcrypt");
const EmployeeModel = require("../models/employeeModel");

const createAdmin = async () => {
  try {
    const adminExists = await EmployeeModel.findOne({
      where: {
        role: "Admin",
      },
    });
    if (adminExists) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await EmployeeModel.create({
      employee_id: "ADMIN001",
      first_name: "System",
      last_name: "Admin",
      father_name: "System",
      cnic: "00000-0000000-0",
      dob: "1990-01-01",
      address: "Head Office",
      salary: 100000,
      email: "admin@company.com",
      password: hashedPassword,
      department_id: "IT",
      manager_id: "No manager",
      role: "Admin",
    });
    console.log("Admin is created successfully");
  } catch (error) {
    console.error("Admin error is", error);
  }
};

module.exports = createAdmin;
