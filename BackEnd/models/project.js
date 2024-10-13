const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Industry = require('./industry'); // Import Industry model

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  industry_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'industry',
      key: 'industry_id'
    },
    allowNull: true // If industry_id can be null
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  project_discipline: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  project_size: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  profession: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  location_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT, // Text field for longer content
    allowNull: false
  },
  project_status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image_path: {
    type: DataTypes.STRING(50), // Rename from image to image_path
    allowNull: false
  }
}, {
  timestamps: false
});

// Define the association (Project belongs to an Industry)
Project.belongsTo(Industry, { foreignKey: 'industry_id' });

module.exports = Project;
