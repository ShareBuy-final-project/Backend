// const bcrypt = require('bcrypt');
const Transaction = require('../data/models/transaction');
const { validate } = require('./validation');
const {makeTransfer} = require('./paymentGateway');

const pay = async ({items, accessToken}) => {
    try{
        //const {userEmail} = validate(accessToken);
        const a = await makeTransfer({items});

        // Transaction.create({
        //     userEmail: id,
        //     groupId: group_id,
        //     amount: credit,
        //     Date: Date.now(),
        // });
        return { a };
    }
    catch(error){
        throw new Error('Error making payment');
    }
    
} 
module.exports = {pay};
    
