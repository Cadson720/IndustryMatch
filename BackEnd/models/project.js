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
      model: 'Industry', // Ensure the table name matches exactly as it is in your DB
      key: 'industry_id'
    },
    allowNull: true
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  location_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  discipline: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(255), // Based on your column allowing 150 characters
    allowNull: true
  }
}, {
  timestamps: false
});

// Define the association (Project belongs to an Industry)
Project.belongsTo(Industry, { foreignKey: 'industry_id' });

module.exports = Project;
