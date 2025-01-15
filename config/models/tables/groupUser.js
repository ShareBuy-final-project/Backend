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
  }
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = GroupUser;
