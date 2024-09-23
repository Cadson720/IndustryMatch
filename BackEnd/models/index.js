const sequelize = require('../config/database');
const User = require('./user');
const Project = require('./project');

const db = {
  User,
  Project,
  sequelize
};

module.exports = db;