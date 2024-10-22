const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedProject = sequelize.define('SavedProject', {
  saved_project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  academic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,  // No timestamps required
});

module.exports = SavedProject;
