const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
}, {
  tableName: 'RefreshToken', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = RefreshToken;