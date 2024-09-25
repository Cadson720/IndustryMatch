const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admins', {
    AdminID: {
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
    EOIID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'EOIs',
        key: 'EOIID'
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