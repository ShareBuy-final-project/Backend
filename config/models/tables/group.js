const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Business = require('./business');
const User = require('./user');
const fs = require('fs');
const path = require('path');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creator: { //email of the user
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Business,
      key: 'businessNumber'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  purchaseMade: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Group', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = Group;
