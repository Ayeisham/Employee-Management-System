const DepartmentService = require("../services/departmentService");

const DepartmentController = {
  getDepartments: async (req, res) => {
    try {
      const departments = await DepartmentService.getDepartments();
      res.status(200).json(departments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = DepartmentController;
