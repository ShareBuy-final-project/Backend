const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Business = sequelize.define('Business', {
  businessName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  websiteLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  }
}, {
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

const insertInitialBusinesses = async () => {
  const existingBusinesses = await Business.findAll();
  if (existingBusinesses.length > 0) {
    console.log('Initial businesses already exist');
    return;
  }

  const business = [
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

  await Business.bulkCreate(business);
  console.log('Initial businesses inserted');
};

insertInitialBusinesses().catch(error => {
  console.error('Error inserting initial businesses:', error.message);
});

module.exports = Business;
