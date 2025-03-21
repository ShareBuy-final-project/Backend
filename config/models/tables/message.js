const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Chat = require('./chat');
const User = require('./user');

const Message = sequelize.define('Message', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: 'groupId'
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Message',
  timestamps: true,
  updatedAt: false
});

module.exports = Message;
