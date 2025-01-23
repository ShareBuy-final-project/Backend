const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Business = sequelize.define('Business', {
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  websiteLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  }
}, {
  tableName: 'Business', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = Business;