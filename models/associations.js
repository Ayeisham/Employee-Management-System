// models/associations.js
const Employee = require("./employeeModel");
const DailyAttendance = require("./attendanceModel");
const Department = require("./departmentModel");
const Leave = require("./leaveModel");

// One Employee has many attendance records
Employee.hasMany(DailyAttendance, {
  foreignKey: "employee_id",
  sourceKey: "employee_id",
  as: "attendances",
});

// Each DailyAttendance belongs to one Employee
DailyAttendance.belongsTo(Employee, {
  foreignKey: "employee_id",
  targetKey: "employee_id",
  as: "employee",
});

Employee.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

Department.hasMany(Employee, {
  foreignKey: "department_id",
  as: "employee",
});

Employee.hasMany(Leave, {
  foreignKey: "employee_id",
  sourceKey: "employee_id",
  as: "leaves",
});

Leave.belongsTo(Employee, {
  foreignKey: "employee_id",
  targetKey: "employee_id",
  as: "employee",
});

Employee.hasMany(Employee, {
  foreignKey: "manager_id",
  as: "team",
});

Employee.belongsTo(Employee, {
  foreignKey: "manager_id",
  as: "manager",
});

module.exports = { Employee, DailyAttendance, Department, Leave };
