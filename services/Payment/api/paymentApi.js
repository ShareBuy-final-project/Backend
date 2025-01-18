const {handlePayment}= require('../domain/payment');
const {createPaymentIntent} = require('../domain/payment');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports = (app) => {
  app.post('/payment', async (req, res) => {
    console.log('Payment service received request to /payment');
    try {
      const accessToken = req.headers['authorization'][1];
      const items = req.body.items;
      console.log('Payment service received items');
      const data = await createPaymentIntent();
      res.status(201).json(data);
    } catch (error) {
      console.error('Error making payment:', error);
      res.status(400).json({ message: 'Error making payment', error: error.message });
    }
  });
  app.post('/payment/charge', async (req, res) => {
    console.log('Payment service received request to /payment/charge');
    const paymentIntentId = req.body.data.object.payment_intent;
    console.log('req.body:', req.body.data.object.payment_intent);

    res.status(200).json({ message: 'Payment processed successfully' });
  });
};

