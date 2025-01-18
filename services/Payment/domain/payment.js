// const bcrypt = require('bcrypt');
const Transaction = require('../data/models/transaction');
const { validate } = require('./validation');
const {createPaymentIntent} = require('./paymentGateway');

const handlePayment = async () => {
    try{
        console.log('handling payment');
        const data =  await createPaymentIntent();
        paymentIntentId = data.paymentIntentId;
        
        console.log('Payment processed successfully');
        return data;
    }
    catch(error){
        throw new Error('Error making payment');
    }
    
} 
module.exports = {handlePayment};
    
