const { DataTypes } = require('sequelize');
//const sequelize = require('../db');
const {sequelize} = require('models');

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = Business;
