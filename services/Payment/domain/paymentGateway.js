require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const makeTransfer = async ({credit, expiry, id, group_id}) => {
    //return { message: 'Payment processed successfully' };
    const serssion = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation',
                    },
                    unit_amount: credit,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/home`,
        cancel_url: `${process.env.SERVER_URL}/home`,
    });
}
module.exports = {makeTransfer};