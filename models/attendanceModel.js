const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DailyAttendance = sequelize.define(
  "DailyAttendance",
  {
    serial_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("checkIn", "checkOut"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "dailyattendance",
    timestamps: false,
  }
);

module.exports = DailyAttendance;
