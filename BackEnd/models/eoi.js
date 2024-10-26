const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Industry = require('./industry'); // Import Industry model
const Academic = require('./academic'); // Import Academic model
const Project = require('./project'); // Import Project model

const EOI = sequelize.define('EOIs', {
  eoi_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  industry_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Industries',
      key: 'industry_id'
    },
    allowNull: true
  },
  academic_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Academics',
      key: 'academic_id'
    },
    allowNull: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Projects',
      key: 'project_id'
    },
    allowNull: true
  },
  eoi_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  proposal_description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eoi_status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});



module.exports = EOI;
