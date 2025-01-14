const { create, getGroup } = require('../domain/group');
const { validate } = require('../domain/validation');
const { SavedGroup, Group} = require('models');
const express = require('express');

module.exports = (app) => {
  app.use(express.json());
  app.post('/create', async (req, res) => {// Implemnt function by calling the function register from 'domain/user'
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
  
  app.get('/get', async (req, res) => {
    try {
      const { id } = req.body;
      const group = await getGroup(id);
      res.status(200).json(group);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching group', error: error.message });
    }
  });

  app.get('/getPage', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const accessToken = req.headers.authorization.split(' ')[1];
      
      await validate(accessToken);

      const offset = (page - 1) * limit;
      const groups = await Group.findAll({ offset, limit });

      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching groups', error: error.message });
    }
  });

  app.get('/getSavedGroups', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);

      const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
      const groupIds = savedGroups.map(sg => sg.groupId);
      const groups = await Group.findAll({ where: { id: groupIds } });

      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching saved groups', error: error.message });
    }
  });
};

