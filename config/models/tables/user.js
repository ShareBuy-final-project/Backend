const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'User', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

// This code will be executed when the module is loaded. 
// It will insert the initial users into the database if they do not already exist.

module.exports = User;
