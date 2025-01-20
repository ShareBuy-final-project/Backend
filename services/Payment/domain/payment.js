// const bcrypt = require('bcrypt');
// const { Business, User } = require('models');
const { validate } = require('./validation');
const {createPaymentIntent} = require('./paymentGateway');
const e = require('express');

const handlePayment = async ({group, accessToken}) => {
    try{
        console.log('handling payment');
        // const group_id = group.id;

        // const {customerEmail} = validate(accessToken);
        // if(!customerEmail){
        //     throw new Error('Invalid token');
        // }

        // const group_data = getGroup(group_id);
        // if(!group_data){
        //     throw new Error('Group not found');
        // }
        
        // const {seller, price} = group_data;
        const seller = 'acct_1JQg9a2GBz0nP5L';
        const price = 100;
        const payment_intent_data =  await createPaymentIntent({seller,price});
        if(!payment_intent_data.paymentIntentId){
            throw new Error('Error creating payment intent');
        }

        // paymentIntentId = payment_intent_data.paymentIntentId;
        // const transaction = new ({
        //     paymentIntentId,
        //     groupId,
        //     customerEmail,
        //     confirmed: false,
        // });
        // transaction.save();

        console.log('Payment processed successfully');
        return payment_intent_data;
    }
    catch(error){
        console.log(error.message);
        throw new Error('Error making payment');
    }
    
} 
module.exports = {handlePayment};
    
