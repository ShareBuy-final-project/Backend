// const bcrypt = require('bcrypt');
const { Business, User, Group, GroupUser } = require('models');
const { validate } = require('./validation');
const {createPaymentIntent} = require('./paymentGateway');
const e = require('express');

const handlePayment = async (groupId, amount, accessToken) => {
    try{
        console.log('handling payment');
        const id = groupId;
        console.log('accessToken:', accessToken);
        const {customerEmail} = validate(accessToken);
        const group_data = Group.findOne({ where: { id } });
        if(!group_data){
            throw new Error('Group not found');
        }
        
        const {businessNumber, price, discount} = group_data;
        const newPrice = (price * (100-discount) / 100) * amount
        const {userEmail} = Business.findOne({ where: { businessNumber } });
        const businessUserEmail = userEmail

        const payment_intent_data =  await createPaymentIntent({businessUserEmail,price});
        if(!payment_intent_data.paymentIntentId){
            throw new Error('Error creating payment intent');
        }

        console.log('Payment processed successfully');
        return payment_intent_data;
    }
    catch(error){
        console.log(error.message);
        throw new Error('Error making payment');
    }
    
} 
const updateCharged = async ({paymentIntentId}) => {
    try{
        console.log('updating confirmed to true for paymentIntent:', paymentIntentId);
        await GroupUser.update(
            { confirmed: true },
            { where: { paymentIntentId } }
          );
    }
    catch(error){
        console.log(error.message);
        throw new Error('Error updating payment');
        ///TODO add logic, maybe inform user and remove from db
    }
}
module.exports = {handlePayment, updateCharged};
    
