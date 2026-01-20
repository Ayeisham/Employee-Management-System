const departmentRepository = require("../repositories/departmentRepositories");

const DepartmentService = {
  getDepartments: async () => {
    const departments = await departmentRepository.getDepartmentsForDropdown();

    return departments;
  },
};

module.exports = DepartmentService;
