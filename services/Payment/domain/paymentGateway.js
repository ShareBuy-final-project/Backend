require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);



const createPaymentIntent = async ({businessUserEmail,price}) => {
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
    publishableKey: 'pk_live_51Qg9a2GBz0nP5LootWzP7eE1QOKCAMgG5b2TNMgIi62zdQ32MFl8gM18r2HzJDYrX5sox7nFXgh4vlAv6UN6Tilf005CzZCwH9',
    paymentIntentId: paymentIntent.id
  }; 
}
module.exports = {createPaymentIntent};