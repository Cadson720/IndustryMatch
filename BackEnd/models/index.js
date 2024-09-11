const sequelize = require('../config/database');
const User = require('./user');

const db = {
  User,
  sequelize
};

module.exports = db;