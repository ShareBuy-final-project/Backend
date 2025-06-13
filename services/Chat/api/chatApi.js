const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { getGroupChat, getGroupChatsOfUser } = require('../domain/chat');
const { validate } = require('../domain/validation');
const { LastSeen } = require('models');

module.exports = (app) => {
 
  // HTTP Routes
  app.post('/group/getGroupChat', async (req, res) => {
    const { groupId, page = 1, limit = 10 } = req.body; // Use page to calculate offset
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);

      const lastSeen = await LastSeen.findOne({ where: { groupId, userEmail } });
      const lastSeenTimestamp = lastSeen ? lastSeen.timestamp : new Date(0);

      const offset = (page - 1) * limit; // Calculate offset based on page number
      const messages = await getGroupChat(groupId, offset, limit);

      const unreadMessages = messages.filter(msg => msg.createdAt > lastSeenTimestamp);
      const readMessages = messages.filter(msg => msg.createdAt <= lastSeenTimestamp);

      console.log(`Fetched ${messages.length} messages for groupId: ${groupId}`);
      res.json({ messages, unreadMessagesCount: unreadMessages.length });
    } catch (error) {
      console.error('Error fetching group chat messages:', error);
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error getting group chat', error: error.message });
      }
    }
  });

  app.get('/group/getGroupChatsOfUser', async (req, res) => {
    try {
      console.log('Fetching group chats for user');
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const groupChats = await getGroupChatsOfUser(userEmail);
      res.json(groupChats);
    } catch (error) {
      console.error('Error fetching group chats:', error);
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error getting group chat', error: error.message });
      }
    }
  });

  // Return both app and server so they can be used in your main file
  return { app };
};
