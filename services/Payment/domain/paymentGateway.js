require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const {getGroup} = require('../data/models/groups');

const makeTransfer = async ({items}) => {
    //return { message: 'Payment processed successfully' };
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map (item => {
            const group = getGroup(item.id)
            console.log("price",group.price)
            return {
                price_data: {
                    currency: 'usd',
                    unit_amount: group.price,
                    product_data: {
                        name: "some_name",
                    },
                },
                quantity: item.quantity,
            }
        }
        ),
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/home`,
        cancel_url: `${process.env.SERVER_URL}/home`,
    });
    return {url: session.url}
}
module.exports = {makeTransfer};