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
      allowNull: true
    },
    publish_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    project_discipline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    project_size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    project_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: false
  });

// Define the association (Project belongs to an Industry)
Project.belongsTo(Industry, { foreignKey: 'industry_id' });

module.exports = Project;
