const { GroupChat, Message, GroupUser, Group } = require('models');

const getGroupChat = async (groupId) => {
  const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
  return messages;
};

const getGroupChatsOfUser = async (userEmail) => {
  const groupUsers = await GroupUser.findAll({
    where: { userEmail },
    include: [{ model: Group, attributes: ['name', 'image'] }]
  });

  const groupChats = await Promise.all(
    groupUsers.map(async (groupUser) => {
      const lastMessage = await Message.findOne({
        where: { groupId: groupUser.groupId },
        order: [['createdAt', 'DESC']],
        attributes: ['content', 'createdAt']
      });

      return {
        id: groupUser.groupId,
        groupName: groupUser.Group.name,
        lastMessage: lastMessage ? lastMessage.content : null,
        timestamp: lastMessage ? lastMessage.createdAt : null,
        unreadCount: 0,
        image: groupUser.Group.image
      };
    })
  );

  return groupChats;
};

const joinGroup = async (socket, groupId, userEmail) => {
  const groupUser = await GroupUser.findOne({ where: { groupId, userEmail } });
  const groupChat = await GroupChat.findOne({ where: { groupId, isActive: true } });
  if (groupUser && groupChat) {
    socket.join(groupId);
    const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
    socket.emit('chatHistory', messages);
  }
};

const sendMessage = async (io, groupId, userEmail, content) => {
  const groupUser = await GroupUser.findOne({ where: { groupId, userEmail } });
  const groupChat = await GroupChat.findOne({ where: { groupId, isActive: true } });
  if (groupUser && groupChat) {
    const message = await Message.create({ groupId, userEmail, content });
    io.to(groupId).emit('newMessage', message);
  }
};

module.exports = {
  getGroupChat,
  getGroupChatsOfUser,
  joinGroup,
  sendMessage
};
