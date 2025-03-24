const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streetNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'User', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

// This code will be executed when the module is loaded. 
// It will insert the initial users into the database if they do not already exist.

const insertInitialUsers = async () => {
  const existingUsers = await User.findAll();
  if (existingUsers.length > 0) {
    console.log('Initial users already exist');
    return;
  }

  const users = [
    { fullName: 'User 1', email: 'user1@example.com', password: 'password1', phone: '1234567890', state: 'State 1', city: 'City 1', street: 'Street 1', streetNumber: '1', zipCode: '10001' },
    { fullName: 'User 2', email: 'user2@example.com', password: 'password2', phone: '1234567891', state: 'State 2', city: 'City 2', street: 'Street 2', streetNumber: '2', zipCode: '10002' },
    { fullName: 'User 3', email: 'user3@example.com', password: 'password3', phone: '1234567892', state: 'State 3', city: 'City 3', street: 'Street 3', streetNumber: '3', zipCode: '10003' },
    { fullName: 'User 4', email: 'user4@example.com', password: 'password4', phone: '1234567893', state: 'State 4', city: 'City 4', street: 'Street 4', streetNumber: '4', zipCode: '10004' },
    { fullName: 'User 5', email: 'user5@example.com', password: 'password5', phone: '1234567894', state: 'State 5', city: 'City 5', street: 'Street 5', streetNumber: '5', zipCode: '10005' },
    { fullName: 'User 6', email: 'user6@example.com', password: 'password6', phone: '1234567895', state: 'State 6', city: 'City 6', street: 'Street 6', streetNumber: '6', zipCode: '10006' },
    { fullName: 'User 7', email: 'user7@example.com', password: 'password7', phone: '1234567896', state: 'State 7', city: 'City 7', street: 'Street 7', streetNumber: '7', zipCode: '10007' },
    { fullName: 'User 8', email: 'user8@example.com', password: 'password8', phone: '1234567897', state: 'State 8', city: 'City 8', street: 'Street 8', streetNumber: '8', zipCode: '10008' },
    { fullName: 'User 9', email: 'user9@example.com', password: 'password9', phone: '1234567898', state: 'State 9', city: 'City 9', street: 'Street 9', streetNumber: '9', zipCode: '10009' },
    { fullName: 'User 10', email: 'user10@example.com', password: 'password10', phone: '1234567899', state: 'State 10', city: 'City 10', street: 'Street 10', streetNumber: '10', zipCode: '10010' },
    { fullName: 'User 11', email: 'user11@example.com', password: 'password11', phone: '1234567800', state: 'State 11', city: 'City 11', street: 'Street 11', streetNumber: '11', zipCode: '10011' },
    { fullName: 'User 12', email: 'user12@example.com', password: 'password12', phone: '1234567801', state: 'State 12', city: 'City 12', street: 'Street 12', streetNumber: '12', zipCode: '10012' },
    { fullName: 'User 13', email: 'user13@example.com', password: 'password13', phone: '1234567802', state: 'State 13', city: 'City 13', street: 'Street 13', streetNumber: '13', zipCode: '10013' },
    { fullName: 'User 14', email: 'user14@example.com', password: 'password14', phone: '1234567803', state: 'State 14', city: 'City 14', street: 'Street 14', streetNumber: '14', zipCode: '10014' },
    { fullName: 'User 15', email: 'user15@example.com', password: 'password15', phone: '1234567804', state: 'State 15', city: 'City 15', street: 'Street 15', streetNumber: '15', zipCode: '10015' },
    { fullName: 'User 16', email: 'user16@example.com', password: 'password16', phone: '1234567805', state: 'State 16', city: 'City 16', street: 'Street 16', streetNumber: '16', zipCode: '10016' },
    { fullName: 'User 17', email: 'user17@example.com', password: 'password17', phone: '1234567806', state: 'State 17', city: 'City 17', street: 'Street 17', streetNumber: '17', zipCode: '10017' },
    { fullName: 'User 18', email: 'user18@example.com', password: 'password18', phone: '1234567807', state: 'State 18', city: 'City 18', street: 'Street 18', streetNumber: '18', zipCode: '10018' },
    { fullName: 'User 19', email: 'user19@example.com', password: 'password19', phone: '1234567808', state: 'State 19', city: 'City 19', street: 'Street 19', streetNumber: '19', zipCode: '10019' },
    { fullName: 'User 20', email: 'user20@example.com', password: 'password20', phone: '1234567809', state: 'State 20', city: 'City 20', street: 'Street 20', streetNumber: '20', zipCode: '10020' },
    { fullName: 'User 21', email: 'user21@example.com', password: 'password21', phone: '1234567810', state: 'State 21', city: 'City 21', street: 'Street 21', streetNumber: '21', zipCode: '10021' },
    { fullName: 'User 22', email: 'user22@example.com', password: 'password22', phone: '1234567811', state: 'State 22', city: 'City 22', street: 'Street 22', streetNumber: '22', zipCode: '10022' },
    { fullName: 'User 23', email: 'user23@example.com', password: 'password23', phone: '1234567812', state: 'State 23', city: 'City 23', street: 'Street 23', streetNumber: '23', zipCode: '10023' },
    { fullName: 'User 24', email: 'user24@example.com', password: 'password24', phone: '1234567813', state: 'State 24', city: 'City 24', street: 'Street 24', streetNumber: '24', zipCode: '10024' },
    { fullName: 'User 25', email: 'user25@example.com', password: 'password25', phone: '1234567814', state: 'State 25', city: 'City 25', street: 'Street 25', streetNumber: '25', zipCode: '10025' }
  ];

  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  await User.bulkCreate(users);
  console.log('Initial users inserted');
};

insertInitialUsers().catch(error => {
  console.error('Error inserting initial users:', error.message);
});

module.exports = User;
