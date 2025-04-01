const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Business = require('./business');
const User = require('./user');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userEmail: { 
    type: DataTypes.STRING, 
    allowNull: false,
    references: { model: User, key: 'email' }, 
    onDelete: 'CASCADE'
  },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1, max: 5 } 
  },
  reviewText: { type: DataTypes.TEXT, allowNull: true },
  businessNumber: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    references: { model: Business, key: 'businessNumber' },
    onDelete: 'CASCADE'
  }
}, { 
    tableName: 'Review', // Specify the table name
    timestamps: false // Disable the automatic addition of createdAt and updatedAt fields 
});

const insertInitialReviews = async () => {
    const existingReviews = await Review.findAll();
    if (existingReviews.length > 0) {
      console.log('Initial reviews already exist');
      return;
    }
  
    const userEmails = [
      "user1@example.com", "user2@example.com", "user3@example.com", "user4@example.com",
      "user5@example.com", "user6@example.com", "user7@example.com", "user8@example.com",
      "user9@example.com"
    ];
  
    const businessNumbers = [
      "B001", "B002", "B003", "B004", "B005", "B006", "B007", "B008", "B009", "B010",
      "B011", "B012", "B013", "B014", "B015", "B016", "B017", "B018", "B019", "B020",
      "B021", "B022", "B023", "B024", "B025"
    ];
  
    const reviews = [
      { userEmail: userEmails[0], rating: 5, reviewText: "Excellent service!", businessNumber: businessNumbers[0] },
      { userEmail: userEmails[1], rating: 4, reviewText: "Fast and reliable.", businessNumber: businessNumbers[1] },
      { userEmail: userEmails[2], rating: 3, reviewText: "Could be better.", businessNumber: businessNumbers[2] },
      { userEmail: userEmails[3], rating: 5, reviewText: "Fantastic experience!", businessNumber: businessNumbers[3] },
      { userEmail: userEmails[4], rating: 2, reviewText: "Customer support was unhelpful.", businessNumber: businessNumbers[4] },
      { userEmail: userEmails[5], rating: 4, reviewText: "Good quality, reasonable price.", businessNumber: businessNumbers[5] },
      { userEmail: userEmails[6], rating: 5, reviewText: "Highly recommend this place!", businessNumber: businessNumbers[6] },
      { userEmail: userEmails[7], rating: 1, reviewText: "Disappointed with the service.", businessNumber: businessNumbers[7] },
      { userEmail: userEmails[8], rating: 3, reviewText: "It was okay, nothing special.", businessNumber: businessNumbers[8] },
      { userEmail: userEmails[0], rating: 4, reviewText: "Nice staff and fast response!", businessNumber: businessNumbers[9] },
      { userEmail: userEmails[1], rating: 5, reviewText: "Outstanding!", businessNumber: businessNumbers[10] },
      { userEmail: userEmails[2], rating: 2, reviewText: "I expected more.", businessNumber: businessNumbers[11] },
      { userEmail: userEmails[3], rating: 3, reviewText: "Not bad, but not great.", businessNumber: businessNumbers[12] },
      { userEmail: userEmails[4], rating: 5, reviewText: "Absolutely loved it!", businessNumber: businessNumbers[13] },
      { userEmail: userEmails[5], rating: 4, reviewText: "Pretty good overall.", businessNumber: businessNumbers[14] },
      { userEmail: userEmails[6], rating: 2, reviewText: "Not what I expected.", businessNumber: businessNumbers[15] },
      { userEmail: userEmails[7], rating: 1, reviewText: "Worst experience ever.", businessNumber: businessNumbers[16] },
      { userEmail: userEmails[8], rating: 3, reviewText: "Just average.", businessNumber: businessNumbers[17] },
      { userEmail: userEmails[0], rating: 5, reviewText: "Perfect!", businessNumber: businessNumbers[18] },
      { userEmail: userEmails[1], rating: 4, reviewText: "Good, will return.", businessNumber: businessNumbers[19] },
      { userEmail: userEmails[2], rating: 3, reviewText: "Meh.", businessNumber: businessNumbers[20] },
      { userEmail: userEmails[3], rating: 5, reviewText: "Amazing!", businessNumber: businessNumbers[21] },
      { userEmail: userEmails[4], rating: 4, reviewText: "Decent place.", businessNumber: businessNumbers[22] },
      { userEmail: userEmails[5], rating: 2, reviewText: "Not worth the money.", businessNumber: businessNumbers[23] },
      { userEmail: userEmails[6], rating: 5, reviewText: "Best experience ever!", businessNumber: businessNumbers[24] },
    ];
  
    await Review.bulkCreate(reviews);
    console.log("Initial reviews inserted successfully.");
  };
  
  insertInitialReviews().catch(error => {
    console.error("Error inserting initial reviews:", error.message);
  });
  
  module.exports = Review;
  
