const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Group = require('./group');
const User = require('./user');

const LastSeen = sequelize.define('LastSeen', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    },
    primaryKey: true
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    },
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'LastSeen',
  timestamps: false
});

module.exports = LastSeen;
