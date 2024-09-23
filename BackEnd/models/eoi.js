const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExpressionOfInterest = sequelize.define('EOI', {
    EOIID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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

module.exports = EOI;