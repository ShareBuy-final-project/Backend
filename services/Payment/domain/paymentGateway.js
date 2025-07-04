require('dotenv').config();
const stripe = require('stripe')('sk_test_51Qg9a2GBz0nP5LooWmlsEb404mhwdvAvxatXAmUFCFv8bCC4U0kxhKqUJ2Xl2cXmBUH6kAmj2zWRtMY2T47StATT00PH1hFVZn');
const publishableKey = 'pk_test_51Qg9a2GBz0nP5Loo5OXv3znrj1HFtp7pFa0cHkECXnvWbwAJFMYpYrvRLbw4An6eUmOM4EeUJ7BuhwgJj6JlUq1g003hKQsNBH'


const createPaymentIntent = async (businessUserEmail,price) => {
  const account = null
  try{
    account = await stripe.accounts.retrieve(businessUserEmail);
  }
  catch{
    console.log("No Stripe account has been found for business with email:", businessUserEmail)
  }
  const accountId = account == null ? null : account.accountId
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
    ...(accountId && { transfer_data: { destination: accountId } })
  });
  console.log('Payment intent created:', paymentIntent.id);
  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: publishableKey,
    paymentIntentId: paymentIntent.id
  }; 
}

const makePaymentTranscations = async (paymentIntentIds) => {
  console.log('Confirming payment intents...');
  for (const paymentIntentId of paymentIntentIds) {
    try{
        const paymentIntent = await stripe.paymentIntents.capture(
          paymentIntentId,
        );
        console.log('Payment intent confirmed:', paymentIntent.id);
      }
    catch (error) {
      console.log('Error confirming payment intent, continuing with next payment intent');
    }
  }
}

const createConnectedAccount = async (businessUserEmail) => {
  const account = await stripe.accounts.create({
    type: 'express', 
    email: businessUserEmail, 
  });
  return account.id;
}

const createAccountLink = async (accountId) => {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://e875-89-138-169-65.ngrok-free.app/account-onboarding-success',
    type: 'account_onboarding',
  });
  return accountLink.url;
}


module.exports = {createPaymentIntent, makePaymentTranscations, createConnectedAccount, createAccountLink};