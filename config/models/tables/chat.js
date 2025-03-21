const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Group = require('./group');

const Chat = sequelize.define('Chat', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    }
  }
}, {
  tableName: 'Chat',
  timestamps: false
});

module.exports = Chat;
