const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: {
        rejectUnauthorized: false // Use if SSL is required, adjust based on your needs
    }
});

module.exports = sequelize;
