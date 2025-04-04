const { GroupChat, Message, GroupUser, Group } = require('models');

const getGroupChat = async (groupId) => {
    const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
    return messages;
};

const convertImageToBase64 = (image) => {
  return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
};

const getChatDetails = async (groupId, groupName, groupImage, owner) => {
  console.log(`Fetching last message for groupId: ${groupId}`);
  const lastMessage = await Message.findOne({
    where: { groupId },
    order: [['createdAt', 'DESC']],
    attributes: ['content', 'createdAt']
  });

  console.log(`Last message for groupId ${groupId}:`, lastMessage ? lastMessage.content : 'null');
  return {
    id: groupId,
    groupName,
    lastMessage: lastMessage ? lastMessage.content : 'no messages in the chat',
    timestamp: lastMessage ? lastMessage.createdAt : null,
    unreadCount: 0,
    image: convertImageToBase64(groupImage),
    owner
  };
};

const getGroupChatsOfUser = async (userEmail) => {
  console.log(`Fetching group chats for userEmail: ${userEmail}`);

  // Fetch groups the user is a member of
  const groupUsers = await GroupUser.findAll({
    where: { userEmail },
    include: [{ model: Group, attributes: ['name', 'image'] }]
  });
  console.log(`Found ${groupUsers.length} groups for userEmail: ${userEmail}`);

  // Fetch groups the user created
  const createdGroups = await Group.findAll({
    where: { creator: userEmail },
    attributes: ['id', 'name', 'image']
  });
  console.log(`Found ${createdGroups.length} groups created by userEmail: ${userEmail}`);

  console.log('Group users:', groupUsers);
  console.log('Created groups:', createdGroups);

  // Combine both sets of groups
  const groupChats = await Promise.all([
    ...groupUsers.map((groupUser) =>
      getChatDetails(groupUser.groupId, groupUser.Group.name, groupUser.Group.image, false)
    ),
    ...createdGroups.map((group) =>
      getChatDetails(group.id, group.name, group.image, true)
    )
  ]);

  console.log(`Returning group chats for userEmail: ${userEmail}`);
  return groupChats;
};

const joinGroup = async (socket, groupId, userEmail) => {
    const groupUser = await GroupUser.findOne({ where: { groupId, userEmail } });
  const groupChat = await GroupChat.findOne({ where: { groupId, isActive: true } });
  if (groupUser && groChat) {
        socket.join(groupId);
    const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
        socket.emit('chatHistory', messages);
    }
};

const saveMessageToDB = async (groupId, userEmail, content) => {
  return await Message.create({ groupId, userEmail, content });
};

const sendMessage = async (io, groupId, userEmail, content) => {
  // TODO: check if the chat is active?
  const message = await saveMessageToDB(groupId, userEmail, content);
  console.log(`Message saved to DB: ${message.content}`);
  io.to(groupId).emit('newMessage', message);
};

module.exports = {
  getGroupChat,
  getGroupChatsOfUser,
  joinGroup,
  sendMessage
};
