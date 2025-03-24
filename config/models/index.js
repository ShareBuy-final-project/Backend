const User = require('./tables/user');
const Group = require('./tables/group');
const SavedGroup = require('./tables/savedGroup');
const Business = require('./tables/business');
const RefreshToken = require('./tables/refreshToken');
const GroupUser = require('./tables/groupUser');
const groupChat = require('./tables/groupChat');
const privateChat = require('./tables/privateChat');
const message = require('./tables/message');
const sequelize = require('./db');

module.exports = {
  User,
  Group,
  SavedGroup,
  Business,
  RefreshToken,
  GroupUser,
  groupChat,
  privateChat,
  message,
  sequelize
};
