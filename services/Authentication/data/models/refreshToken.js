const { DataTypes } = require('sequelize');
const sequelize = require('..\\..\\..\\config\\db');
const refreshToken = sequelize.define('RefreshToken', {
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

module.exports = refreshToken;