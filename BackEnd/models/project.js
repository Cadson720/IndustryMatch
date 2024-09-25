const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Industry = require('./industry'); // Import Industry model

const Project = sequelize.define('Project', {
    ProjectID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    MemberID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Industry',
        key: 'MemberID'
      },
      allowNull: true
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    discipline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    },
    industry: {
      type: DataTypes.ENUM(
        'Analytics and Data Science',
        'Business',
        'Communication',
        'Design, Architecture and Building',
        'Education',
        'Engineering',
        'Health',
        'Health (GEM)',
        'Information Technology',
        'International Studies and Social Sciences',
        'Law',
        'Science and Mathematics',
        'Transdisciplinary Innovation'
      ),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

// Define the association (Project belongs to an Industry)
Project.belongsTo(Industry, { foreignKey: 'MemberID' });

module.exports = Project;
