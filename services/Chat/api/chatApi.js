const { getGroupChat, getGroupChatsOfUser, joinGroup, sendMessage } = require('../domain/chat');
const { validate } = require('../domain/validation');

module.exports = (app, io) => {
  app.post('/chat/group/getGroupChat', async (req, res) => {
    const { groupId } = req.body;
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      await validate(accessToken);
      const messages = await getGroupChat(groupId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  app.get('/chat/group/getGroupChatsOfUser', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const groupChats = await getGroupChatsOfUser(userEmail);
      res.json(groupChats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch group chats' });
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinGroup', async ({ groupId, userEmail }) => {
      await joinGroup(socket, groupId, userEmail);
    });

    socket.on('sendMessage', async ({ groupId, userEmail, content }) => {
      await sendMessage(io, groupId, userEmail, content);
    });
  });
};
