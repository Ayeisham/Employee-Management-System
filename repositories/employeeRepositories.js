//only access data from DB
const Employee = require("../models/employeeModel");
const Department = require("../models/departmentModel");
const DailyAttendance = require("../models/attendanceModel");
const Leave = require("../models/leaveModel");

const EmployeeRepository = {
  findEmployeeById: async (employee_id) => {
    return await Employee.findOne({
      where: { employee_id },
    });
  },

  createEmployee: async (employeeData) => {
    return await Employee.create(employeeData);
  },
  getEmployeeDropdown: async () => {
    return await Employee.findAll({
      attributes: ["first_name", "last_name", "employee_id"],
    });
  },
  checkAttendance: async (employee_id, date) => {
    return await DailyAttendance.findAll({
      where: {
        employee_id,
        date,
      },
    });
  },
  putAttendance: async (data) => {
    return await DailyAttendance.create(data);
  },

  getTeamAttendance: async (manager_id) => {
    return await DailyAttendance.findAll({
      include: [
        {
          model: Employee,
          as: "employee",
          where: { manager_id },
          attributes: [
            "employee_id",
            "first_name",
            "last_name",
            "department_id",
          ],
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["department_name"],
            },
          ],
        },
      ],

      //   where: date ? { date } : {}, // optional date filter
      order: [
        ["date", "DESC"],
        ["time", "ASC"],
      ],
    });
  },

  createLeaveRequest: async (data) => {
    return await Leave.create(data);
  },

  getMyLeavesList: async (employee_id) => {
    return await Leave.findAll({
      where: {
        employee_id,
      },
      order: [["leave_id", "DESC"]],
    });
  },

  getAllLeavesByManager: async (manager_id) => {
    return await Leave.findAll({
      attributes: [
        "leave_id",
        "employee_id",
        "leave_type",
        "start_date",
        "end_date",
        "reason",
        "status",
      ],
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["first_name", "last_name"],
          where: { manager_id },
        },
      ],
      order: [["applied_at", "DESC"]],
    });
  },
  updateLeaveStatus: async (leave_id, status) => {
    const [updatedRows] = await Leave.update(
      { status },
      { where: { leave_id } }
    );

    return updatedRows;
  },
};

module.exports = EmployeeRepository;
