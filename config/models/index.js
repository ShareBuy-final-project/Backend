const User = require('./tables/user');
const Group = require('./tables/group');
const SavedGroup = require('./tables/savedGroup');
const Business = require('./tables/business');
const RefreshToken = require('./tables/refreshToken');
const GroupUser = require('./tables/groupUser');
const GroupChat = require('./tables/groupChat');
const PrivateChat = require('./tables/privateChat');
const Message = require('./tables/message');
const LastSeen = require('./tables/lastSeen');
const sequelize = require('./db');

// Define associations
Group.hasMany(GroupUser, { foreignKey: 'groupId' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId' });

Group.hasOne(GroupChat, { foreignKey: 'groupId' });
GroupChat.belongsTo(Group, { foreignKey: 'groupId' });

GroupChat.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(GroupChat, { foreignKey: 'groupId' });

User.hasMany(GroupUser, { foreignKey: 'userEmail' });
GroupUser.belongsTo(User, { foreignKey: 'userEmail' });

User.hasMany(Group, { foreignKey: 'creator' });
Group.belongsTo(User, { foreignKey: 'creator' });

Business.hasMany(Group, { foreignKey: 'businessNumber' });
Group.belongsTo(Business, { foreignKey: 'businessNumber' });

User.hasMany(PrivateChat, { foreignKey: 'userEmail' });
PrivateChat.belongsTo(User, { foreignKey: 'userEmail' });

Business.hasMany(PrivateChat, { foreignKey: 'businessNumber' });
PrivateChat.belongsTo(Business, { foreignKey: 'businessNumber' });

User.hasMany(LastSeen, { foreignKey: 'userEmail' });
LastSeen.belongsTo(User, { foreignKey: 'userEmail' });

Group.hasMany(LastSeen, { foreignKey: 'groupId' });
LastSeen.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = {
  User,
  Group,
  SavedGroup,
  Business,
  RefreshToken,
  GroupUser,
  GroupChat,
  PrivateChat,
  Message,
  LastSeen,
  sequelize
};
