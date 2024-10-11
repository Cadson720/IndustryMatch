const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Industry = sequelize.define('Industry', {
    industry_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    industry_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    industry_discipline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    industry_password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = Industry;
