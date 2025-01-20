const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const GroupUser = sequelize.define('GroupUser', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id'
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
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
