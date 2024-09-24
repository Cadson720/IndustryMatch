const sequelize = require('../config/database');
const Academic = require('./academic');
const Admin = require('./admin');
const expressionOfInterest = require('./eoi');
const Industry = require('./industry');
const Project = require('./project');
const User = require('./user');

const db = {
  Academic,
  Admin,
  expressionOfInterest,
  Industry,
  Project,
  User,
  sequelize
};

module.exports = db;