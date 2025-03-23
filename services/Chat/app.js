const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize } = require('models');
const chatApi = require('./api/chatApi');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",  // Configure this according to your security needs
    methods: ["GET", "POST"],
    credentials: true
  },
});

console.log('Starting Chat service...');

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Chat service received request: ${req.method} ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

io.on('connection', (socket) => {
  console.log('User connected to chat service');
  socket.on('sendMessage', async ({ groupId, userEmail, content }) => {
    try {
      await sendMessage(io, groupId, userEmail, content);
      console.log(`Message sent to group ${groupId} by ${userEmail}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from chat service');
  });
});

const connectWithRetry = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();
chatApi(app);
