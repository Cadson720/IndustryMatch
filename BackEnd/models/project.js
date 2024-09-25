const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Projects', {
    ProjectID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    MemberID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Industries',
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
    size: {  // Only one size field
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
    },
    title: {  // Newly added title field
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  (async () => {
    await sequelize.sync({ force: true });  // Use `force: true` only if you're okay with resetting the data
    console.log("Project synced");
  })();

module.exports = Project;
