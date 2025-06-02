const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const Group = require('./group');

const SavedGroup = sequelize.define('savedGroup', {
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Group,
      key: 'id'
    }
  },
}, {
  tableName: 'SavedGroup', // Specify the table name
  timestamps: false // Disable the automatic addition of createdAt and updatedAt fields
});

const insertInitialSavedGroups = async () => {
  // Find the minimum groupId from the Group table
  const minGroup = await Group.findOne({ order: [['id', 'ASC']] });
  if (!minGroup) {
    console.log('No groups found, cannot insert saved groups');
    return;
  }
  const minGroupId = minGroup.id;

  const existing = await SavedGroup.findAll();
  if (existing.length > 0) {
    console.log('Initial saved groups already exist');
    return;
  }

  // Use consecutive groupIds starting from minGroupId
  const savedGroups = [
    { userEmail: 'user1@example.com', groupId: minGroupId },
    { userEmail: 'user1@example.com', groupId: minGroupId + 1 },
    { userEmail: 'user2@example.com', groupId: minGroupId + 2 },
    { userEmail: 'user3@example.com', groupId: minGroupId + 3 },
    { userEmail: 'user4@example.com', groupId: minGroupId + 4 },
    { userEmail: 'user5@example.com', groupId: minGroupId + 5 },
    { userEmail: 'user5@example.com', groupId: minGroupId + 6 },
  ];

  await SavedGroup.bulkCreate(savedGroups);
  console.log('Initial saved groups inserted');
};

// insertInitialSavedGroups().catch(err => {
//   console.error('Error inserting saved groups:', err.message);
// });

module.exports = SavedGroup;
