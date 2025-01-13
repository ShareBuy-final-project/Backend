const Group = require('../data/models/group');
const { create, getGroup } = require('../domain/group');
const express = require('express');
module.exports = (app) => {
  app.use(express.json());
  app.post('/groups/create', async (req, res) => {// Implemnt function by calling the function register from 'domain/user'
    try {
      const {  name, user, details, image,price,discount,size } = req.body;
  
      // Call the register function from 'domain/user'
      const newGroup = await create({  name, user, details, image,price,discount,size });
  
      res.status(201).json({ message: 'Group created successfully', group: newGroup });
      console.log('Group created successfully');
    } catch (error) {
      res.status(400).json({ message: 'Error creating group', error: error.message });
    }  
  });
  
  app.get('/groups/get', async (req, res) => {
    try {
      const { id } = req.body;
      const group = await getGroup(id);
      res.status(200).json(group);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching group', error: error.message });
    }
  });
};

