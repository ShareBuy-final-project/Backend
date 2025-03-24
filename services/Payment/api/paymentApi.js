const {handlePayment, updateCharged, createBusinessAccount}= require('../domain/payment');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51Qg9a2GBz0nP5LooWmlsEb404mhwdvAvxatXAmUFCFv8bCC4U0kxhKqUJ2Xl2cXmBUH6kAmj2zWRtMY2T47StATT00PH1hFVZn');

module.exports = (app) => {
  app.post('/paymentIntent', async (req, res) => {
    console.log('Payment service received request to /payment');
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const groupId = req.body.groupId;
      const amount = req.body.amount;
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
      const {paymentIntentId} = req.body;
      const result = await updateCharged(paymentIntentId);
      res.status(200).json(result);
    }
    catch(error){
      console.error('Error processing payment:', error);
      res.status(400).json({ message: 'Error processing payment', error: error.message });
    }
  });

  app.post('/create-connected-account', async (req, res) => {
    try {
      console.log('Creating connected account');
      const {businessUserEmail} = req.body;
      console.log('1231233businessUserEmail:', businessUserEmail);
      const accountId = await createBusinessAccount(businessUserEmail);
      console.log('accountId in api:', accountId);
      res.status(200).json({ id: accountId }); // The generated account ID is returned to the client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/create-account-link', async (req, res) => {
  const { accountId } = req.body;
    console.log('Creating account link for account:', accountId);
    try {
      
      res.json({ url: accountLink.url });
    } catch (error) {
      console.log(error + 'error');
      res.status(500).send({ error: error.message });
    }
  });

  app.get('/account-onboarding-success', (req, res) => {
    console.log('Account onboarding successful');
    const redirectToApp = 'exp://10.100.102.6:8081';
    res.redirect(redirectToApp);
  });
};

