require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);



const createPaymentIntent = async (businessUserEmail,price) => {
  //const account = await stripe.accounts.retrieve(businessUserEmail);
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2024-12-18.acacia'}
  );
  console.log('Making payment intent...');
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price*100, // Amount in cents (e.g., $50 = 5000)
    currency: 'usd',
    payment_method_types: ['card'],
    customer: customer.id,
    capture_method: 'manual',
    confirm: false, 
    description: 'Group purchase authorization',
    // transfer_data: {
    //   destination: account.id,
    // },
  });
  console.log('Payment intent created:', paymentIntent.id);
  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51Qg9a2GBz0nP5Loo5OXv3znrj1HFtp7pFa0cHkECXnvWbwAJFMYpYrvRLbw4An6eUmOM4EeUJ7BuhwgJj6JlUq1g003hKQsNBH',
    paymentIntentId: paymentIntent.id
  }; 
}

const makePaymentTranscations = async (paymentIntentIds) => {
  console.log('Confirming payment intents...');
  for (const paymentIntentId of paymentIntentIds) {
    const paymentIntent = await stripe.paymentIntents.capture(
      paymentIntentId,
    );
    console.log('Payment intent confirmed:', paymentIntent.id);
  }
}
module.exports = {createPaymentIntent, makePaymentTranscations};