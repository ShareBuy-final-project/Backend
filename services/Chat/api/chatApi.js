const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { getGroupChat, getGroupChatsOfUser} = require('../domain/chat');
const { validate } = require('../domain/validation');

module.exports = (app) => {
 
  // HTTP Routes
  app.post('/group/getGroupChat', async (req, res) => {
    const { groupId } = req.body;
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      await validate(accessToken);
      const messages = await getGroupChat(groupId);
      console.log(`Fetched ${messages.length} messages for groupId: ${groupId}`);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat messages' });
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
      res.status(500).json({ error: 'Failed to fetch group chats' });
    }
  });

  // Return both app and server so they can be used in your main file
  return { app };
};
