const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    father_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    department_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    manager_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Employee",
    },
  },
  {
    tableName: "employees",
    timestamps: true,
    hooks: {
      beforeCreate: async (employee) => {
        employee.password = await bcrypt.hash(employee.password, 10);
      },
    },
  },
);

module.exports = Employee;
