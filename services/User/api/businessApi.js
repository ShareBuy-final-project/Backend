const { Business, Review, User } = require('models');
const { getBusinessByNumber, submitReview } = require('../domain/business');

module.exports = (app) => {
  /**
   * @api {get} /user/number/:businessNumber Get business by number
   * @apiName GetBusinessByNumber
   * @apiGroup Business
   *
   * @apiParam {String} businessNumber Business number
   *
   * @apiSuccess {Object} business Business object with reviews and user info
   */
  app.get('/businessNumber/:businessNumber', async (req, res) => {
    console.log('Business service received request to /user/number/:businessNumber');
    try {
      const { businessNumber } = req.query.businessNumber; 
      const business = await getBusinessByNumber(businessNumber);
      console.log("business", business);
      if (!business) {
        return res.status(404).json({ message: 'Business not found' });
      }
      res.status(200).json(business);
    } catch (error) {
      console.error('Error fetching business:', error);
      res.status(400).json({ message: 'Error fetching business', error: error.message });
    }
  });

  /**
   * @api {post} /user/review Submit a review
   * @apiName SubmitReview
   * @apiGroup Review
   *
   * @apiBody {String} businessNumber
   * @apiBody {String} userEmail
   * @apiBody {Number} rating
   * @apiBody {String} reviewText
   *
   * @apiSuccess {Object} review Created review object
   */
  app.post('/review', async (req, res) => {
    console.log('Business service received request to /user/review');
    try {
      const review = await submitReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(400).json({ message: 'Error submitting review', error: error.message });
    }
  });
};
