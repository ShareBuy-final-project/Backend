const {handlePayment, updateCharged, createBusinessAccount, createLinkForBusinessRegistration}= require('../domain/payment');
const { validate } = require('../domain/validation');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51Qg9a2GBz0nP5LooWmlsEb404mhwdvAvxatXAmUFCFv8bCC4U0kxhKqUJ2Xl2cXmBUH6kAmj2zWRtMY2T47StATT00PH1hFVZn');

module.exports = (app) => {
  app.post('/paymentIntent', async (req, res) => {
    console.log('Payment service received request to /payment');
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const groupId = req.body.groupId;
      const amount = req.body.amount;
      const data = await handlePayment(groupId, amount, accessToken);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error making payment:', error);
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error making payment', error: error.message });
      }
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
      const {businessUserEmail} = req.body;
      const accountId = await createBusinessAccount(businessUserEmail);
      res.status(200).json({ id: accountId }); // The generated account ID is returned to the client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/create-account-link', async (req, res) => {
  const { accountId } = req.body;
    console.log('Creating account link for account:', accountId);
    try {
      const accountLink = await createLinkForBusinessRegistration(accountId);
      console.log('accountLink:', accountLink);
      res.status(200).json({ url: accountLink });
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

