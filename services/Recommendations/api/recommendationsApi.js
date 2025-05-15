const { getRecommendationsForUser } = require('../domain/recommendations');
const { trainRecommendationModel } = require('../domain/model'); // Assuming this function is defined in your domain
const { validate } = require('../domain/validation');

module.exports = (app) => {
  /**
   * @api {get} /recommendations Get recommendations for a user
   * @apiName GetRecommendations
   * @apiGroup Recommendations
   * 
   * @apiSuccess {Object[]} recommendations List of recommended groups.
   */
  app.get('/recommendations', async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        const { userEmail } = await validate(accessToken);

        if (!userEmail) {
            return res.status(400).json({ message: 'User not found' });
        }

        const recommendations = await getRecommendationsForUser(userEmail);

        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(400).json({ message: 'Internal server error' });
    }
  });
};

app.get('/runModel', async (req, res) => {
    try{
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            res.status(401).json({ message: 'Access token is required' });
            return;
        }

        const { userEmail } = await validate(accessToken);
        if (!userEmail) {
            res.status(404).json({ message: 'User not found' });
            return
        }
        if(!userEmail === 'user1@example.com'){
            res.status(403).json({ message: 'Access denied' });
            return
        }
        else{
            console.log('Running model...');
            await trainRecommendationModel()
            res.status(200).json({ message: 'Model training completed successfully' });
        }
        
    }
    catch(error){
        console.error('Error running model:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});