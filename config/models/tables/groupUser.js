const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Group = require('./group');

const GroupUser = sequelize.define('GroupUser', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
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
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  paymentConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = GroupUser;
