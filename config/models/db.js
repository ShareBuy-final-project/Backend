const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
  isTest ? 'sqlite::memory:' : process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: isTest ? undefined : process.env.DB_HOST,
    dialect: isTest ? 'sqlite' : 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
