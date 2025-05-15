const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Group = require('./group');

const GroupUser = sequelize.define('GroupUser', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  paymentConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
  },
}, {
  tableName: 'GroupUser', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

const insertInitialGroupUsers = async () => {
  const existingEntries = await GroupUser.findAll();
  if (existingEntries.length > 0) {
    console.log('Initial group-user entries already exist');
    return;
  }

  const groupUsers = [
    // user1 in groups 1, 2
    { groupId: 26, userEmail: 'user1@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_101' },
    { groupId: 27, userEmail: 'user1@example.com', amount: 1, paymentConfirmed: false, paymentIntentId: 'pi_102' },

    // user2 in groups 1, 3, 4
    { groupId: 26, userEmail: 'user2@example.com', amount: 2, paymentConfirmed: true, paymentIntentId: 'pi_201' },
    { groupId: 28, userEmail: 'user2@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_202' },
    { groupId: 29, userEmail: 'user2@example.com', amount: 1, paymentConfirmed: false, paymentIntentId: 'pi_203' },

    // user3 in groups 2, 4
    { groupId: 27, userEmail: 'user3@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_301' },
    { groupId: 29, userEmail: 'user3@example.com', amount: 1, paymentConfirmed: false, paymentIntentId: 'pi_302' },

    // user4 in groups 1, 2, 3, 5
    { groupId: 26, userEmail: 'user4@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_401' },
    { groupId: 27, userEmail: 'user4@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_402' },
    { groupId: 28, userEmail: 'user4@example.com', amount: 2, paymentConfirmed: false, paymentIntentId: 'pi_403' },
    { groupId: 30, userEmail: 'user4@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_404' },

    // user5 in group 3
    { groupId: 30, userEmail: 'user5@example.com', amount: 1, paymentConfirmed: true, paymentIntentId: 'pi_501' }
  ];

  await GroupUser.bulkCreate(groupUsers);
  console.log('Initial group-user connections inserted');
};


module.exports = GroupUser;
