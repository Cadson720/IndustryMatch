const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

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
        model: 'industry',
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
    profession: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  (async () => {
    console.log("Project synced");
  })

module.exports = Project;