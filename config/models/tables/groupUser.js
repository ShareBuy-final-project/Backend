const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const GroupUser = sequelize.define('GroupUser', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Group',
      key: 'id'
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User',
      key: 'email'
    }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = GroupUser;
