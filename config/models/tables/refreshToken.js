const { DataTypes } = require('sequelize');
//const sequelize = require('../db');
const {sequelize} = require('models');

const RefreshToken = sequelize.define('RefreshToken', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RefreshToken;