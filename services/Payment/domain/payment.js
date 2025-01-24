// const bcrypt = require('bcrypt');
const { Business, User, Group, GroupUser } = require('models');
const { validate } = require('./validation');
const {createPaymentIntent, makePaymentTranscations} = require('./paymentGateway');
const e = require('express');


const handlePayment = async (groupId, amount, accessToken) => {
    try{
        console.log('handling payment');
        const id = groupId;
        const {customerEmail} = await validate(accessToken);
        const group_data = await Group.findOne({ where: { id } });
        if(!group_data){
            throw new Error('Group not found');
        }
        const {businessNumber, price, discount} = group_data;
        const newPrice = discount * amount
        const {userEmail} = await Business.findOne({ where: { businessNumber } });
        const businessUserEmail = userEmail

        const payment_intent_data =  await createPaymentIntent(businessUserEmail,newPrice);
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
const updateCharged = async (paymentIntentId) => {
    try{
        const group_user = await GroupUser.findOne({ where: { paymentIntentId: paymentIntentId }})
        group_user.update({ paymentConfirmed: true });
        await group_user.save();

        const group_user_new = await GroupUser.findOne({ where: { paymentIntentId: paymentIntentId }})
        if (await isGroupFUll(group_user_new.groupId)){
            return await makeTranscations(group_user_new.groupId);
        }
        else {
            return { message: 'Payment processed successfully' };
        }
    }
    catch(error){
        console.log(error.message);
        throw new Error('Error updating payment');
        ///TODO add logic, maybe inform user and remove from db
    }
}

const isGroupFUll = async (groupId) => {
  const currentAmount = getTotalAmount(groupId);
  const group = Group.findByPk(groupId); 
  return  currentAmount + amount == group.size;
}

const getTotalAmount = async (id) =>{ 
    return await GroupUser.sum('amount', { where: { groupId: id, paymentConfirmed: true  } }
  )};

const makeTranscations = async (groupId) => {
    const group_users = await GroupUser.findAll({ where: { groupId: groupId, paymentConfirmed: true  } });
    const paymentIntentIds = group_users.map(group_user => group_user.paymentIntentId);
    await makePaymentTranscations(paymentIntentIds);
    await updateGroupToPurchased(groupId);
    return { message: 'Payment processed successfully, and all transactions occurred' };
}

const updateGroupToPurchased = async (groupId) => {
    const group = await Group.findByPk(groupId);
    group.update({ isActive: false, purchaseMade: true });
    await group.save();
}
module.exports = {handlePayment, updateCharged};
    
