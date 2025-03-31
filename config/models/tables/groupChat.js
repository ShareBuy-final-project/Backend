const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Group = require('./group');

const GroupChat = sequelize.define('GroupChat', {
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: Group,
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'GroupChat',
  timestamps: false
});

const initializeGroupChats = async () => {
  const existingGroupChats = await GroupChat.findAll();
  console.log('Checking if group chats already exist');

  if (existingGroupChats.length > 0) {
    console.log('Group chats already exist, skipping initialization');
    return;
  }

  const groups = await Group.findAll();
  console.log('Initializing group chats for groups');

  for (const group of groups) {
    const [groupChat, created] = await GroupChat.findOrCreate({
      where: { groupId: group.id },
      defaults: { isActive: true }
    });

    if (created) {
      console.log(`Group chat created for group ID: ${group.id}`);
    } else {
      console.log(`Group chat already exists for group ID: ${group.id}`);
    }
  }
};

initializeGroupChats().catch(error => {
  console.error('Error initializing group chats:', error.message);
});

module.exports = GroupChat;
