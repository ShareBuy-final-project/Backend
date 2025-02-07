const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Group = require('./group');

const SavedGroup = sequelize.define('savedGroup', {
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    }
  },
}, {
  tableName: 'SavedGroup', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = SavedGroup;
