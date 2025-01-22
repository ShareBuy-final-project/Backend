const {handlePayment, updateCharged}= require('../domain/payment');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = (app) => {
  app.post('/paymentIntent', async (req, res) => {
    console.log('Payment service received request to /payment');
    try {
      const accessToken = req.headers['authorization'][1];
      const groupId = req.body.groupId;
      const amount = req.body.amount;
      console.log('Payment service received items');
      const data = await handlePayment(groupId, amount, accessToken);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error making payment:', error);
      res.status(400).json({ message: 'Error making payment', error: error.message });
    }
  });
  app.post('/charge', async (req, res) => {
    console.log('Payment service received request to /payment/charge');
    try{
      const paymentIntentId = req.body.data.object.payment_intent;
      updateCharged(paymentIntentId);
      res.status(200).json({ message: 'Payment processed successfully' });
    }
    catch(error){
      console.error('Error processing payment:', error);
      res.status(400).json({ message: 'Error processing payment', error: error.message });
    }
  });
};

