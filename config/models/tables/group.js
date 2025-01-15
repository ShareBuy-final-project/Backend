const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creator: { //email of the user
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'email'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: 'Businesses',
      key: 'businessNumber'
    }
  }
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

module.exports = Group;
