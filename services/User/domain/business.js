const { Business, Review, User } = require('models');

/**
 * Get business by number
 * @param {String} businessNumber
 * @returns {Promise<Object|null>}
 */
const getBusinessByNumber = async (businessNumber) => {
  return await Business.findOne({
    where: { businessNumber },
    include: [
      {
        model: Review,
        include: [
          {
            model: User,
            attributes: ['id', 'fullName', 'email']
          }
        ]
      }
    ]
  });
};

/**
 * Submit new review
 * @param {Object} reviewData
 * @returns {Promise<Object>}
 */
const submitReview = async (reviewData) => {
  const { businessNumber, userEmail, rating, reviewText } = reviewData;

  const business = await Business.findOne({ where: { businessNumber } });
  if (!business) throw new Error('Business not found');

  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) throw new Error('User not found');

  return await Review.create({
    businessNumber, 
    userEmail,      
    rating,
    reviewText
  });
};

module.exports = {
  getBusinessByNumber,
  submitReview
};
