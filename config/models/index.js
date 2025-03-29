const User = require('./tables/user');
const Group = require('./tables/group');
const SavedGroup = require('./tables/savedGroup');
const Business = require('./tables/business');
const RefreshToken = require('./tables/refreshToken');
const GroupUser = require('./tables/groupUser');
const GroupChat = require('./tables/groupChat');
const PrivateChat = require('./tables/privateChat');
const Message = require('./tables/message');
const sequelize = require('./db');

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
  sequelize
};
