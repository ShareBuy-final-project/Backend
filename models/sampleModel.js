const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');

const Sample = db.define('Sample', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Sample;
