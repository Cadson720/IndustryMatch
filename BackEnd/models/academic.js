const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const academic = sequelize.define('academics', {
    academic_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    academic_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    academic_password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false
  });

module.exports = academic;