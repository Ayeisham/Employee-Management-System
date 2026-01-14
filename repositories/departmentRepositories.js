

const Department = require("../models/departmentModel");

const departmentRepository = {
  getDepartmentsForDropdown: async () => {
    return await Department.findAll({
      where :{
        status:1
      },
      attributes: ["department_id", "department_name"]
    });
  }
};

module.exports = departmentRepository;