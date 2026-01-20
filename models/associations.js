// models/associations.js
const Employeez = require("./employeeModel");
const dailyAttendance = require("./attendanceModel");
const dpartment = require("./departmentModel");
const Leavez = require("./leaveModel");

// One Employee has many attendance records
Employeez.hasMany(dailyAttendance, {
  foreignKey: "employee_id",
  sourceKey: "employee_id",
  as: "attendances",
});

// Each DailyAttendance belongs to one Employee
dailyAttendance.belongsTo(Employeez, {
  foreignKey: "employee_id",
  targetKey: "employee_id",
  as: "employee",
});

Employeez.belongsTo(dpartment, {
  foreignKey: "department_id",
  as: "department",
 
});

dpartment.hasMany(Employeez, {
  foreignKey: "department_id",
  as: "employees",
});

Employeez.hasMany(Leavez, {
  foreignKey: "employee_id",
  sourceKey: "employee_id",
  as: "leaves",
});

Leavez.belongsTo(Employeez, {
  foreignKey: "employee_id",
  targetKey: "employee_id",
  as: "employee",
});

module.exports = { Employeez, dailyAttendance, dpartment, Leavez };
