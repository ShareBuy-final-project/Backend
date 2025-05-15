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

// 💾 הכנסת נתונים ראשוניים
const insertInitialSavedGroups = async () => {
  const existing = await SavedGroup.findAll();
  if (existing.length > 0) {
    console.log('Initial saved groups already exist');
    return;
  }

  const savedGroups = [
    { userEmail: 'user1@example.com', groupId: 26 },
    { userEmail: 'user1@example.com', groupId: 28 },
    { userEmail: 'user2@example.com', groupId: 27 },
    { userEmail: 'user3@example.com', groupId: 30 },
    { userEmail: 'user4@example.com', groupId: 29 },
    { userEmail: 'user5@example.com', groupId: 28 },
    { userEmail: 'user5@example.com', groupId: 26 },
  ];

  await SavedGroup.bulkCreate(savedGroups);
  console.log('Initial saved groups inserted');
};

insertInitialSavedGroups().catch(err => {
  console.error('Error inserting saved groups:', err.message);
});

module.exports = SavedGroup;
