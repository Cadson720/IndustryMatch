const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Industry = sequelize.define('Industry', {
  industry_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  industry_email: {
    type: DataTypes.STRING(50), // Character varying (50) length limit
    allowNull: false,
    unique: true
  },
  industry_discipline: {
    type: DataTypes.STRING(50), // Character varying (50) length limit
    allowNull: false
  },
  organisation: {
    type: DataTypes.STRING(50), // Character varying (50) length limit
    allowNull: false
  },
  industry_password: {
    type: DataTypes.STRING(50), // Character varying (50) length limit
    allowNull: false
  }
}, {
  timestamps: false // No timestamps in the schema
});

module.exports = Industry;
