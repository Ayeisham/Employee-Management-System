const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Leave = sequelize.define(
  "Leave",
  {
    leave_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    leave_type: {
      type: DataTypes.ENUM("Sick", "Casual", "Annual"),
      allowNull: false,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    reason: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },

    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "leaves",
    timestamps: false,
  }
);

module.exports = Leave;
