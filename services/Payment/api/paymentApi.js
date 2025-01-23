const {handlePayment, updateCharged}= require('../domain/payment');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51Qg9a2GBz0nP5LooWmlsEb404mhwdvAvxatXAmUFCFv8bCC4U0kxhKqUJ2Xl2cXmBUH6kAmj2zWRtMY2T47StATT00PH1hFVZn');

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

  app.post('/create-connected-account', async (req, res) => {
    try {
      const account = await stripe.accounts.create({
        type: 'express', // You can also use 'custom' based on your use case
        email: 'business@example.com', // Replace with actual business email
      });
      res.json({ id: account.id }); // The generated account ID is returned to the client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/create-account-link', async (req, res) => {
  const { accountId } = req.body;
    console.log('Creating account link for account:', accountId);
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://e875-89-138-169-65.ngrok-free.app/account-onboarding-success',
        type: 'account_onboarding',
      });
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

