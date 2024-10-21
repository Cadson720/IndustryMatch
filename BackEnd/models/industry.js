const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Industry = sequelize.define('Industry', {
  industry_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  industry_email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  industry_discipline: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  organisation: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  industry_password: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Industries', // Exact table name as shown in the database
  timestamps: false // No timestamps in this table
});

module.exports = Industry;
