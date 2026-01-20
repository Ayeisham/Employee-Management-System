const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Department = sequelize.define(
  "Department",
  {
    department_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    department_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "departments",
    timestamps: false,
  }
);

(async () => {
  try {
    await sequelize.sync();
    await Department.bulkCreate(
      [
        { department_id: "QA", department_name: "QA TEAM", status: 1 },
        {
          department_id: "FE",
          department_name: "Frontend Development",
          status: 1,
        },
        {
          department_id: "BE",
          department_name: "Backend Development",
          status: 1,
        },
        { department_id: "IT", department_name: "IT TEAM", status: 1 },
        { department_id: "HR", department_name: "Human Resources", status: 1 },
      ],
      { ignoreDuplicates: true }
    );
    console.log("Departments seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
})();

module.exports = Department;
