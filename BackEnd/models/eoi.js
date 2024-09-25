const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const expressionOfInterest = sequelize.define('EOIs', {
    EOIID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    MemberID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Industries',
        key: 'MemberID'
      },
      allowNull: true
    },
    AcademicID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Academics',
        key: 'AcademicId'
      },
      allowNull: true
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects',
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