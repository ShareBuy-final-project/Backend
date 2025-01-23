const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Business = require('./business');
const User = require('./user');

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
      model: User,
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
      model: Business,
      key: 'businessNumber'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  purchaseMade: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'Group', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

const insertInitialGroups = async () => {
  const existingGroups = await Group.findAll();
  if (existingGroups.length > 0) {
    console.log('Initial groups already exist');
    return;
  }

  const groups = [
    { name: 'Group 1', creator: 'user1@example.com', description: 'Description 1', image: null, price: 100, discount: 10, size: 5, category: 'Category 1', businessNumber: 'B001' },
    { name: 'Group 2', creator: 'user2@example.com', description: 'Description 2', image: null, price: 200, discount: 20, size: 10, category: 'Category 2', businessNumber: 'B002' },
    { name: 'Group 3', creator: 'user3@example.com', description: 'Description 3', image: null, price: 300, discount: 30, size: 15, category: 'Category 3', businessNumber: 'B003' },
    { name: 'Group 4', creator: 'user4@example.com', description: 'Description 4', image: null, price: 400, discount: 40, size: 20, category: 'Category 4', businessNumber: 'B004' },
    { name: 'Group 5', creator: 'user5@example.com', description: 'Description 5', image: null, price: 500, discount: 50, size: 25, category: 'Category 5', businessNumber: 'B005' },
    { name: 'Group 6', creator: 'user6@example.com', description: 'Description 6', image: null, price: 600, discount: 60, size: 30, category: 'Category 6', businessNumber: 'B006' },
    { name: 'Group 7', creator: 'user7@example.com', description: 'Description 7', image: null, price: 700, discount: 70, size: 35, category: 'Category 7', businessNumber: 'B007' },
    { name: 'Group 8', creator: 'user8@example.com', description: 'Description 8', image: null, price: 800, discount: 80, size: 40, category: 'Category 8', businessNumber: 'B008' },
    { name: 'Group 9', creator: 'user9@example.com', description: 'Description 9', image: null, price: 900, discount: 90, size: 45, category: 'Category 9', businessNumber: 'B009' },
    { name: 'Group 10', creator: 'user10@example.com', description: 'Description 10', image: null, price: 1000, discount: 100, size: 50, category: 'Category 10', businessNumber: 'B010' },
    { name: 'Group 11', creator: 'user11@example.com', description: 'Description 11', image: null, price: 1100, discount: 110, size: 55, category: 'Category 11', businessNumber: 'B011' },
    { name: 'Group 12', creator: 'user12@example.com', description: 'Description 12', image: null, price: 1200, discount: 120, size: 60, category: 'Category 12', businessNumber: 'B012' },
    { name: 'Group 13', creator: 'user13@example.com', description: 'Description 13', image: null, price: 1300, discount: 130, size: 65, category: 'Category 13', businessNumber: 'B013' },
    { name: 'Group 14', creator: 'user14@example.com', description: 'Description 14', image: null, price: 1400, discount: 140, size: 70, category: 'Category 14', businessNumber: 'B014' },
    { name: 'Group 15', creator: 'user15@example.com', description: 'Description 15', image: null, price: 1500, discount: 150, size: 75, category: 'Category 15', businessNumber: 'B015' },
    { name: 'Group 16', creator: 'user16@example.com', description: 'Description 16', image: null, price: 1600, discount: 160, size: 80, category: 'Category 16', businessNumber: 'B016' },
    { name: 'Group 17', creator: 'user17@example.com', description: 'Description 17', image: null, price: 1700, discount: 170, size: 85, category: 'Category 17', businessNumber: 'B017' },
    { name: 'Group 18', creator: 'user18@example.com', description: 'Description 18', image: null, price: 1800, discount: 180, size: 90, category: 'Category 18', businessNumber: 'B018' },
    { name: 'Group 19', creator: 'user19@example.com', description: 'Description 19', image: null, price: 1900, discount: 190, size: 95, category: 'Category 19', businessNumber: 'B019' },
    { name: 'Group 20', creator: 'user20@example.com', description: 'Description 20', image: null, price: 2000, discount: 200, size: 100, category: 'Category 20', businessNumber: 'B020' },
    { name: 'Group 21', creator: 'user21@example.com', description: 'Description 21', image: null, price: 2100, discount: 210, size: 105, category: 'Category 21', businessNumber: 'B021' },
    { name: 'Group 22', creator: 'user22@example.com', description: 'Description 22', image: null, price: 2200, discount: 220, size: 110, category: 'Category 22', businessNumber: 'B022' },
    { name: 'Group 23', creator: 'user23@example.com', description: 'Description 23', image: null, price: 2300, discount: 230, size: 115, category: 'Category 23', businessNumber: 'B023' },
    { name: 'Group 24', creator: 'user24@example.com', description: 'Description 24', image: null, price: 2400, discount: 240, size: 120, category: 'Category 24', businessNumber: 'B024' },
    { name: 'Group 25', creator: 'user25@example.com', description: 'Description 25', image: null, price: 2500, discount: 250, size: 125, category: 'Category 25', businessNumber: 'B025' }
  ];

  await Group.bulkCreate(groups);
  console.log('Initial groups inserted');
};

insertInitialGroups().catch(error => {
  console.error('Error inserting initial groups:', error.message);
});

// This code will be executed when the module is loaded. 
// It will insert the initial groups into the database if they do not already exist.
module.exports = Group;
