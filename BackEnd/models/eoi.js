const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const expressionOfInterest = sequelize.define('EOI', {
    EOIID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    MemberID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'industry',
        key: 'MemberID'
      },
      allowNull: true
    },
    AcademicID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'academic',
        key: 'AcademicID'
      },
      allowNull: true
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'project',
        key: 'ProjectID'
      },
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    contactDetails: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = expressionOfInterest;