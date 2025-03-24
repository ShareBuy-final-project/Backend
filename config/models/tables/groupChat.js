const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Group = require('./group');

const GroupChat = sequelize.define('GroupChat', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Group,
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'GroupChat',
  timestamps: false
});

module.exports = GroupChat;
