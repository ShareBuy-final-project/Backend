const { getRecommendationsForUser } = require('../domain/recommendations');
const { trainRecommendationModel } = require('models');
const { validate } = require('../domain/validation');
const express = require('express');

module.exports = (app) => {
  /**
   * @api {get} /recommendations Get recommendations for a user
   * @apiName GetRecommendations
   * @apiGroup Recommendations
   * 
   * @apiSuccess {Object[]} recommendations List of recommended groups.
   */
  app.use(express.json());

  app.get('/get', async (req, res) => {
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


