const User = require('./tables/user');
const Group = require('./tables/group');
const Business = require('./tables/business');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'ShareBuyDB',
  'adminDB',
  'adminDB',
  {
    host: 'db',
    dialect: 'postgres',
    logging: false,
  }
);

const readImage = (imagePath) => {
  const resolvedPath = path.resolve(__dirname, imagePath);
  console.log(`Reading image from: ${resolvedPath}`);
  return fs.readFileSync(resolvedPath);
};

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

const insertInitialBusinesses = async () => {
    const existingBusinesses = await Business.findAll();
    if (existingBusinesses.length > 0) {
      console.log('Initial businesses already exist');
      return;
    }
  
    const businesses = [
      { businessName: 'Business 1', businessNumber: 'B001', description: 'Description 1', category: 'Category 1', websiteLink: 'http://business1.com', contactEmail: 'contact1@business.com', userEmail: 'user1@example.com' },
      { businessName: 'Business 2', businessNumber: 'B002', description: 'Description 2', category: 'Category 2', websiteLink: 'http://business2.com', contactEmail: 'contact2@business.com', userEmail: 'user2@example.com' },
      { businessName: 'Business 3', businessNumber: 'B003', description: 'Description 3', category: 'Category 3', websiteLink: 'http://business3.com', contactEmail: 'contact3@business.com', userEmail: 'user3@example.com' },
      { businessName: 'Business 4', businessNumber: 'B004', description: 'Description 4', category: 'Category 4', websiteLink: 'http://business4.com', contactEmail: 'contact4@business.com', userEmail: 'user4@example.com' },
      { businessName: 'Business 5', businessNumber: 'B005', description: 'Description 5', category: 'Category 5', websiteLink: 'http://business5.com', contactEmail: 'contact5@business.com', userEmail: 'user5@example.com' },
      { businessName: 'Business 6', businessNumber: 'B006', description: 'Description 6', category: 'Category 6', websiteLink: 'http://business6.com', contactEmail: 'contact6@business.com', userEmail: 'user6@example.com' },
      { businessName: 'Business 7', businessNumber: 'B007', description: 'Description 7', category: 'Category 7', websiteLink: 'http://business7.com', contactEmail: 'contact7@business.com', userEmail: 'user7@example.com' },
      { businessName: 'Business 8', businessNumber: 'B008', description: 'Description 8', category: 'Category 8', websiteLink: 'http://business8.com', contactEmail: 'contact8@business.com', userEmail: 'user8@example.com' },
      { businessName: 'Business 9', businessNumber: 'B009', description: 'Description 9', category: 'Category 9', websiteLink: 'http://business9.com', contactEmail: 'contact9@business.com', userEmail: 'user9@example.com' },
      { businessName: 'Business 10', businessNumber: 'B010', description: 'Description 10', category: 'Category 10', websiteLink: 'http://business10.com', contactEmail: 'contact10@business.com', userEmail: 'user10@example.com' },
      { businessName: 'Business 11', businessNumber: 'B011', description: 'Description 11', category: 'Category 11', websiteLink: 'http://business11.com', contactEmail: 'contact11@business.com', userEmail: 'user11@example.com' },
      { businessName: 'Business 12', businessNumber: 'B012', description: 'Description 12', category: 'Category 12', websiteLink: 'http://business12.com', contactEmail: 'contact12@business.com', userEmail: 'user12@example.com' },
      { businessName: 'Business 13', businessNumber: 'B013', description: 'Description 13', category: 'Category 13', websiteLink: 'http://business13.com', contactEmail: 'contact13@business.com', userEmail: 'user13@example.com' },
      { businessName: 'Business 14', businessNumber: 'B014', description: 'Description 14', category: 'Category 14', websiteLink: 'http://business14.com', contactEmail: 'contact14@business.com', userEmail: 'user14@example.com' },
      { businessName: 'Business 15', businessNumber: 'B015', description: 'Description 15', category: 'Category 15', websiteLink: 'http://business15.com', contactEmail: 'contact15@business.com', userEmail: 'user15@example.com' },
      { businessName: 'Business 16', businessNumber: 'B016', description: 'Description 16', category: 'Category 16', websiteLink: 'http://business16.com', contactEmail: 'contact16@business.com', userEmail: 'user16@example.com' },
      { businessName: 'Business 17', businessNumber: 'B017', description: 'Description 17', category: 'Category 17', websiteLink: 'http://business17.com', contactEmail: 'contact17@business.com', userEmail: 'user17@example.com' },
      { businessName: 'Business 18', businessNumber: 'B018', description: 'Description 18', category: 'Category 18', websiteLink: 'http://business18.com', contactEmail: 'contact18@business.com', userEmail: 'user18@example.com' },
      { businessName: 'Business 19', businessNumber: 'B019', description: 'Description 19', category: 'Category 19', websiteLink: 'http://business19.com', contactEmail: 'contact19@business.com', userEmail: 'user19@example.com' },
      { businessName: 'Business 20', businessNumber: 'B020', description: 'Description 20', category: 'Category 20', websiteLink: 'http://business20.com', contactEmail: 'contact20@business.com', userEmail: 'user20@example.com' },
      { businessName: 'Business 21', businessNumber: 'B021', description: 'Description 21', category: 'Category 21', websiteLink: 'http://business21.com', contactEmail: 'contact21@business.com', userEmail: 'user21@example.com' },
      { businessName: 'Business 22', businessNumber: 'B022', description: 'Description 22', category: 'Category 22', websiteLink: 'http://business22.com', contactEmail: 'contact22@business.com', userEmail: 'user22@example.com' },
      { businessName: 'Business 23', businessNumber: 'B023', description: 'Description 23', category: 'Category 23', websiteLink: 'http://business23.com', contactEmail: 'contact23@business.com', userEmail: 'user23@example.com' },
      { businessName: 'Business 24', businessNumber: 'B024', description: 'Description 24', category: 'Category 24', websiteLink: 'http://business24.com', contactEmail: 'contact24@business.com', userEmail: 'user24@example.com' },
      { businessName: 'Business 25', businessNumber: 'B025', description: 'Description 25', category: 'Category 25', websiteLink: 'http://business25.com', contactEmail: 'contact25@business.com', userEmail: 'user25@example.com' }
    ];
  
    await Business.bulkCreate(businesses);
    console.log('Initial businesses inserted');
};
  
const initializeDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    await insertInitialUsers();
    await insertInitialBusinesses();
    await insertInitialGroups();
    console.log('Initial data inserted');
  } catch (err) {
    console.error('Error initializing the database:', err);
  } finally {
    await sequelize.close();
  }
};

module.exports = {
  initializeDatabase
};