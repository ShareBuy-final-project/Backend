const { create, getGroup, getGroupsWithSavedStatus, saveGroup } = require('../domain/group');
const { validate } = require('../domain/validation');
const { SavedGroup, Group} = require('models');
const express = require('express');

module.exports = (app) => {
  app.use(express.json());

  /**
   * @api {post} /create Create a new group
   * @apiName CreateGroup
   * @apiGroup Group
   * 
   * @apiParam {String} name Name of the group.
   * @apiParam {String} user User creating the group.
   * @apiParam {String} details Details of the group.
   * @apiParam {String} image Image URL of the group.
   * @apiParam {Number} price Price of the group.
   * @apiParam {Number} discount Discount on the group.
   * @apiParam {String} size Size of the group.
   * 
   * @apiSuccess {Object} group The newly created group.
   */
  app.post('/create', async (req, res) => {
    try {
      const { name, user, details, image, price, discount, size } = req.body;
      const newGroup = await create({ name, user, details, image, price, discount, size });
      res.status(201).json({ message: 'Group created successfully', group: newGroup });
      console.log('Group created successfully');
    } catch (error) {
      res.status(400).json({ message: 'Error creating group', error: error.message });
    }
  });

  /**
   * @api {get} /get Get a group by ID
   * @apiName GetGroup
   * @apiGroup Group
   * 
   * @apiParam {String} id ID of the group.
   * 
   * @apiSuccess {Object} group The requested group.
   */
  app.get('/get', async (req, res) => {
    try {
      const { id } = req.body;
      const group = await getGroup(id);
      res.status(200).json(group);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching group', error: error.message });
    }
  });

  /**
   * @api {get} /getPage Get groups with saved status
   * @apiName GetGroupsWithSavedStatus
   * @apiGroup Group
   * 
   * @apiParam {Number} [page=1] Page number.
   * @apiParam {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups with saved status.
   */
  app.get('/getPage', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const groupsWithSavedStatus = await getGroupsWithSavedStatus({ page, limit, userEmail });
      res.status(200).json(groupsWithSavedStatus);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching groups', error: error.message });
    }
  });

  /**
   * @api {get} /getSavedGroups Get saved groups for a user
   * @apiName GetSavedGroups
   * @apiGroup Group
   * 
   * @apiSuccess {Object[]} groups List of saved groups.
   */
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

  /**
   * @api {post} /saveGroup Save a group for a user
   * @apiName SaveGroup
   * @apiGroup Group
   * 
   * @apiParam {String} groupId ID of the group to be saved.
   * 
   * @apiSuccess {String} message Success message.
   */
  app.post('/saveGroup', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { groupId } = req.body;
      await saveGroup({ userEmail, groupId });
      res.status(200).json({ message: 'Group saved successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error saving group', error: error.message });
    }
  });
};

