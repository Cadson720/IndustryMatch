const sequelize = require('../config/database');
const Academic = require('./academic');
const Admin = require('./admin');
const ExpressionOfInterest = require('./eoi');
const Industry = require('./industry');
const Project = require('./project');
const User = require('./user');

const db = {
  Academic,
  Industry,
  Project,
  sequelize
};

module.exports = db;