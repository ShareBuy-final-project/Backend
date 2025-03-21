const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize, GroupChat, PrivateChat, Message, GroupUser, Group } = require('models');
const { validate } = require('../domain/validation');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

console.log('Starting Chat service...');

app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGroup', async ({ groupId, userEmail }) => {
    const groupUser = await GroupUser.findOne({ where: { groupId, userEmail } });
    const groupChat = await GroupChat.findOne({ where: { groupId, isActive: true } });
    if (groupUser && groupChat) {
      socket.join(groupId);
      const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
      socket.emit('chatHistory', messages);
    }
  });

  socket.on('sendMessage', async ({ groupId, userEmail, content }) => {
    const groupUser = await GroupUser.findOne({ where: { groupId, userEmail } });
    const groupChat = await GroupChat.findOne({ where: { groupId, isActive: true } });
    if (groupUser && groupChat) {
      const message = await Message.create({ groupId, userEmail, content });
      io.to(groupId).emit('newMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/chat/group/getGroupChat', async (req, res) => {
  const { groupId } = req.body;
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    await validate(accessToken);
    const messages = await Message.findAll({ where: { groupId }, order: [['createdAt', 'ASC']] });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

app.get('/chat/group/getGroupChatsOfUser', async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { userEmail } = await validate(accessToken);
    const groupUsers = await GroupUser.findAll({ where: { userEmail }, include: [{ model: Group, attributes: ['name'] }] });
    const groupChats = groupUsers.map(groupUser => ({
      groupId: groupUser.groupId,
      groupName: groupUser.Group.name
    }));
    res.json(groupChats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group chats' });
  }
});

const connectWithRetry = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 9000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();
