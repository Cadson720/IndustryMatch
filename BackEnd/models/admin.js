const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('admins', {
    admin_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    admin_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    admin_password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = Admin;