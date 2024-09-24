const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Industry = sequelize.define('Industry', {
    MemberID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ProjectID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'project',
        key: 'ProjectID'
      },
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    discipline: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = Industry;