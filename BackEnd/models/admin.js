const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    AdminID: {
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
    EOIID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'eoi',
        key: 'EOIID'
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

module.exports = Admin;