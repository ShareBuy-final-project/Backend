const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Business = require('./business');

const PrivateChat = sequelize.define('PrivateChat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Business,
      key: 'businessNumber'
    }
  }
}, {
  tableName: 'PrivateChat',
  timestamps: false
});

module.exports = PrivateChat;
