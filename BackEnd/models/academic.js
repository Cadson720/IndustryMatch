const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Academic = sequelize.define('Academics', {
  academic_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  academic_email: {
    type: DataTypes.STRING(50), // Matching the length in the database (50 characters)
    allowNull: false,
    unique: true
  },
  academic_password: {
    type: DataTypes.STRING(50), // Matching the length in the database (50 characters)
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50), // Matching the length in the database (50 characters)
    allowNull: false
  },
  school: {
    type: DataTypes.STRING(50), // Matching the length in the database (50 characters)
    allowNull: false
  }
}, {
  timestamps: false // No timestamps in the schema
});

module.exports = Academic;
