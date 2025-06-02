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
    { fullName: 'User 25', email: 'user25@example.com', password: 'password25', phone: '1234567814', state: 'State 25', city: 'City 25', street: 'Street 25', streetNumber: '25', zipCode: '10025' },
    { fullName: 'User 26', email: 'user26@example.com', password: 'password26', phone: '1234567815', state: 'State 26', city: 'City 26', street: 'Street 26', streetNumber: '26', zipCode: '10026' },
    { fullName: 'User 27', email: 'user27@example.com', password: 'password27', phone: '1234567816', state: 'State 27', city: 'City 27', street: 'Street 27', streetNumber: '27', zipCode: '10027' },
    { fullName: 'User 28', email: 'user28@example.com', password: 'password28', phone: '1234567817', state: 'State 28', city: 'City 28', street: 'Street 28', streetNumber: '28', zipCode: '10028' },
    { fullName: 'User 29', email: 'user29@example.com', password: 'password29', phone: '1234567818', state: 'State 29', city: 'City 29', street: 'Street 29', streetNumber: '29', zipCode: '10029' },
    { fullName: 'User 30', email: 'user30@example.com', password: 'password30', phone: '1234567819', state: 'State 30', city: 'City 30', street: 'Street 30', streetNumber: '30', zipCode: '10030' },
    { fullName: 'User 31', email: 'user31@example.com', password: 'password31', phone: '1234567820', state: 'State 31', city: 'City 31', street: 'Street 31', streetNumber: '31', zipCode: '10031' },
    { fullName: 'User 32', email: 'user32@example.com', password: 'password32', phone: '1234567821', state: 'State 32', city: 'City 32', street: 'Street 32', streetNumber: '32', zipCode: '10032' },
    { fullName: 'User 33', email: 'user33@example.com', password: 'password33', phone: '1234567822', state: 'State 33', city: 'City 33', street: 'Street 33', streetNumber: '33', zipCode: '10033' },
    { fullName: 'User 34', email: 'user34@example.com', password: 'password34', phone: '1234567823', state: 'State 34', city: 'City 34', street: 'Street 34', streetNumber: '34', zipCode: '10034' },
    { fullName: 'User 35', email: 'user35@example.com', password: 'password35', phone: '1234567824', state: 'State 35', city: 'City 35', street: 'Street 35', streetNumber: '35', zipCode: '10035' },
    { fullName: 'User 36', email: 'user36@example.com', password: 'password36', phone: '1234567825', state: 'State 36', city: 'City 36', street: 'Street 36', streetNumber: '36', zipCode: '10036' },
    { fullName: 'User 37', email: 'user37@example.com', password: 'password37', phone: '1234567826', state: 'State 37', city: 'City 37', street: 'Street 37', streetNumber: '37', zipCode: '10037' },
    { fullName: 'User 38', email: 'user38@example.com', password: 'password38', phone: '1234567827', state: 'State 38', city: 'City 38', street: 'Street 38', streetNumber: '38', zipCode: '10038' },
    { fullName: 'User 39', email: 'user39@example.com', password: 'password39', phone: '1234567828', state: 'State 39', city: 'City 39', street: 'Street 39', streetNumber: '39', zipCode: '10039' },
    { fullName: 'User 40', email: 'user40@example.com', password: 'password40', phone: '1234567829', state: 'State 40', city: 'City 40', street: 'Street 40', streetNumber: '40', zipCode: '10040' },
    { fullName: 'User 41', email: 'user41@example.com', password: 'password41', phone: '1234567830', state: 'State 41', city: 'City 41', street: 'Street 41', streetNumber: '41', zipCode: '10041' },
    { fullName: 'User 42', email: 'user42@example.com', password: 'password42', phone: '1234567831', state: 'State 42', city: 'City 42', street: 'Street 42', streetNumber: '42', zipCode: '10042' },
    { fullName: 'User 43', email: 'user43@example.com', password: 'password43', phone: '1234567832', state: 'State 43', city: 'City 43', street: 'Street 43', streetNumber: '43', zipCode: '10043' },
    { fullName: 'User 44', email: 'user44@example.com', password: 'password44', phone: '1234567833', state: 'State 44', city: 'City 44', street: 'Street 44', streetNumber: '44', zipCode: '10044' },
    { fullName: 'User 45', email: 'user45@example.com', password: 'password45', phone: '1234567834', state: 'State 45', city: 'City 45', street: 'Street 45', streetNumber: '45', zipCode: '10045' },
    { fullName: 'User 46', email: 'user46@example.com', password: 'password46', phone: '1234567835', state: 'State 46', city: 'City 46', street: 'Street 46', streetNumber: '46', zipCode: '10046' },
    { fullName: 'User 47', email: 'user47@example.com', password: 'password47', phone: '1234567836', state: 'State 47', city: 'City 47', street: 'Street 47', streetNumber: '47', zipCode: '10047' },
    { fullName: 'User 48', email: 'user48@example.com', password: 'password48', phone: '1234567837', state: 'State 48', city: 'City 48', street: 'Street 48', streetNumber: '48', zipCode: '10048' },
    { fullName: 'User 49', email: 'user49@example.com', password: 'password49', phone: '1234567838', state: 'State 49', city: 'City 49', street: 'Street 49', streetNumber: '49', zipCode: '10049' },
    { fullName: 'User 50', email: 'user50@example.com', password: 'password50', phone: '1234567839', state: 'State 50', city: 'City 50', street: 'Street 50', streetNumber: '50', zipCode: '10050' }
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
