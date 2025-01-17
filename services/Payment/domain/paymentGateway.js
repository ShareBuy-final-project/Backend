require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const {getGroup} = require('../data/models/groups');

const makeTransfer = async (i) => {
    try{
    console.log('Making payment...');
    const customer = await stripe.customers.create({
        email: "asdasd@test.com",
      });
    console.log('Customer created:', customer.id);
    //return { message: 'Payment processed successfully' };
    // const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-12-18.acacia'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_live_51Qg9a2GBz0nP5LootWzP7eE1QOKCAMgG5b2TNMgIi62zdQ32MFl8gM18r2HzJDYrX5sox7nFXgh4vlAv6UN6Tilf005CzZCwH9'
    };
} catch (error) {
    console.error('Error making payment:', error);
    return { message: 'Error making payment', error: error.message };
}
}
module.exports = {makeTransfer};