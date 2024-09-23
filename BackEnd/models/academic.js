const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Academic = sequelize.define('Academic', {
    AcademicId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
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
    discipline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classes: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prompt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = Academic;