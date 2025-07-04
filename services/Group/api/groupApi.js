const { create, getGroup, saveGroup, joinGroup, leaveGroup, getBusinessGroups, searchGroups, getBusinessHistory, getSavedGroups, getUserHistory, getUserGroups, doesUserHaveGroupWithBusiness } = require('../domain/group');
const { validate } = require('../domain/validation');
const { SavedGroup, Group, GroupUser, Business, GroupChat } = require('models');
const express = require('express');
const sequelize = require('sequelize');
const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs-node');
let useModel = null;

async function loadUSEModel() {
  if (!useModel) {
    useModel = await use.load();
  }
  return useModel;
}

async function getGroupEmbedding({ description, category, price, discount, size }) {
  const model = await loadUSEModel();
  const enrichedText = `
    ${description}
    Category: ${category}.
    Price: $${price}.
    Group size: ${size}.
    Discount: $${discount}.
  `;
  const embeddings = await model.embed([enrichedText]);
  const embeddingArray = await embeddings.array();
  return `[${embeddingArray[0].join(',')}]`;
}


module.exports = (app) => {
  app.use(express.json());

  /**
   * @api {post} /create Create a new group
   * @apiName CreateGroup
   * @apiGroup Group
   * 
   * @apiBody {String} name Name of the group.
   * @apiBody {String} description Description of the group.
   * @apiBody {String} image Image URL of the group.
   * @apiBody {Number} price Price of the group.
   * @apiBody {Number} discount Discount on the group.
   * @apiBody {Number} size Size of the group.
   * 
   * @apiSuccess {Object} group The newly created group.
   */
  app.post('/create', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { name, description, base64Image, price, discount, size } = req.body;

      const business = await Business.findOne({ where: { userEmail } });
      if (!business) {
        return res.status(400).json({ message: 'No business found for the user' });
      }
      
      const embedding = await getGroupEmbedding({
        description,
        category: business.category,
        price,
        discount,
        size
      });

      const newGroup = await create({ 
        name, 
        creator: userEmail, 
        description, 
        base64Image, 
        price, 
        discount, 
        size, 
        category: business.category, 
        businessNumber: business.businessNumber,
        groupEmbedding: embedding
      });
  
      // Create a new group chat for the created group
      await GroupChat.create({ groupId: newGroup.id, isActive: true });

      res.status(201).json({ 
        message: 'Group created successfully', 
        group: newGroup, 
        groupId: newGroup.id // Include groupId in the response
      });
      
      console.log('Group created successfully');
    } catch (error) {
      if(error.response && error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error creating group', error: error.message });
      }
    }
  });

  /**
   * @api {get} /get Get a group by ID
   * @apiName GetGroup
   * @apiGroup Group
   * 
   * @apiBody {String} id ID of the group.
   * 
   * @apiSuccess {Object} group The requested group.
   */
  app.get('/get', async (req, res) => {
    try {
      console.log('req.query', req.query);
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const  id  = req.query.id; 
      if (!id) {
        return res.status(400).json({ message: 'Missing required "id" query parameter' });
      }
      
      const group = await getGroup(userEmail, id);
      res.status(200).json(group);
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error fetching group', error: error.message });
      }
    }
  });

  /**
   * @api {post} /getSavedGroups Get saved groups for a user
   * @apiName GetSavedGroups
   * @apiGroup Group
   * 
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of saved groups.
   */
  app.post('/getSavedGroups', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { page = 1, limit = 10 } = req.body;
      const groups = await getSavedGroups({ userEmail, page, limit });
      res.status(200).json(groups);
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error fetching saved groups', error: error.message });
      }
    }
  });

  /**
   * @api {post} /saveGroup Save a group for a user
   * @apiName SaveGroup
   * @apiGroup Group
   * 
   * @apiBody {String} groupId ID of the group to be saved.
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
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error saving group', error: error.message });
      }
    }
  });

  /**
   * @api {post} /unSaveGroup Unsave a group for a user
   * @apiName UnSaveGroup
   * @apiGroup Group
   * 
   * @apiBody {String} groupId ID of the group to be unsaved.
   * 
   * @apiSuccess {String} message Success message.
   */
  app.post('/unSaveGroup', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { groupId } = req.body;
      await SavedGroup.destroy({ where: { userEmail, groupId } });
      res.status(200).json({ message: 'Group unsaved successfully' });
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error unsaving group', error: error.message });
      }
    }
  });

  /**
   * @api {post} /joinGroup Join a group
   * @apiName JoinGroup
   * @apiGroup Group
   * 
   * @apiBody {String} groupId ID of the group to join.
   * @apiBody {Number} amount Amount the user wants to buy from the group deal.
   * 
   * @apiSuccess {String} message Success message.
   */
  app.post('/joinGroup', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { groupId, amount } = req.body;
      const response = await joinGroup({accessToken, groupId, userEmail, amount });
      res.status(200).json(response.data);
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error joining group', error: error.message });
      }
    }
  });

  /**
   * @api {post} /leaveGroup Leave a group
   * @apiName LeaveGroup
   * @apiGroup Group
   * 
   * @apiBody {String} groupId ID of the group to leave.
   * 
   * @apiSuccess {String} message Success message.
   */
  app.post('/leaveGroup', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { groupId } = req.body;
      await leaveGroup({ groupId, userEmail });
      res.status(200).json({ message: 'Left group successfully' });
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error leaving group', error: error.message });
      }
    }
  });

  /**
   * @api {post} /getPage return the next groups by filters
   * @apiName getNextGroupsPage
   * @apiGroup Group
   * 
   * @apiBody {Object} filters Filters to search groups.
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups matching the search criteria.
   */
  app.post('/getPage', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { filters, page = 1, limit = 10 } = req.body;
      console.log('filters', filters);
      console.log('page', page);
      console.log('limit', limit);
      const groups = await searchGroups({ filters, page, limit, userEmail });
      res.status(200).json(groups);
    } catch (error) {
      if(error.response && error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error searching groups', error: error.message });
      }
    }
  });

  /**
   * @api {post} /businessHistory Get business history
   * @apiName GetBusinessHistory
   * @apiGroup Group
   * 
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups with purchaseMade set to true.
   */
  app.post('/businessHistory', async (req, res) => {
    try {
      console.log('businessHistory');
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { page = 1, limit = 10 } = req.body;
      const groups = await getBusinessHistory(userEmail, page, limit);
      res.status(200).json(groups);
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error fetching business history', error: error.message });
      }
    }
  });

  /**
   * @api {post} /userHistory Get user history
   * @apiName getUserHistory
   * @apiGroup Group
   * 
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups with purchaseMade set to true.
   */
  app.post('/getUserHistory', async (req, res) => {
    try {
      console.log('userHistory');
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { page = 1, limit = 10 } = req.body;
      const groups = await getUserHistory(userEmail, page, limit);
      res.status(200).json(groups);
    } catch (error) {
      if(error.response.status == 401){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      }
      else{
        res.status(400).json({ message: 'Error fetching user history', error: error.message });
      }
    }
  });

  /**
   * @api {post} /userGroups Get user groups
   * @apiName GetUserGroups
   * @apiGroup Group
   * 
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups with purchaseMade set to false and isActive set to true.
   */
  app.post('/getUserGroups', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { page = 1, limit = 10 } = req.body;
      const groups = await getUserGroups(userEmail, page, limit);
      res.status(200).json(groups);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      } else {
        res.status(400).json({ message: 'Error fetching user groups', error: error.message });
      }
    }
  });

  /**
 * @api {post} /hasUserGroupWithBusiness Check if user has group with specific business
 * @apiName HasUserGroupWithBusiness
 * @apiGroup Group
 * 
 * @apiBody {Number} businessId ID of the business to check against.
 * 
 * @apiSuccess {Boolean} hasGroup Whether the user has a group with this business.
 */
  app.post('/hasUserGroupWithBusiness', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { businessId } = req.body;
      console.log("businessId", businessId);
      console.log("userEmail", userEmail);

      if (!businessId) {
        return res.status(400).json({ message: 'Missing businessId' });
      }
  
      const hasGroup = await doesUserHaveGroupWithBusiness(userEmail, businessId);
      console.log("hasGroup", hasGroup);
      res.status(200).json({ hasGroup });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      } else {
        res.status(400).json({ message: 'Error checking user group', error: error.message });
      }
    }
  });
  

  /**
   * @api {post} /getBuisnessGroups Get user groups
   * @apiName getBuisnessGroups
   * @apiGroup Group
   * 
   * @apiBody {Number} [page=1] Page number.
   * @apiBody {Number} [limit=10] Number of groups per page.
   * 
   * @apiSuccess {Object[]} groups List of groups with purchaseMade set to false and isActive set to true.
   */
  app.post('/getBuisnessGroups', async (req, res) => {
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const { userEmail } = await validate(accessToken);
      const { page = 1, limit = 10 } = req.body;
      const groups = await getBusinessGroups(userEmail, page, limit);
      res.status(200).json(groups);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
      } else {
        res.status(400).json({ message: 'Error fetching user groups', error: error.message });
      }
    }
  });

  /**
 * @api {get} /categories Get all unique categories
 * @apiName GetCategories
 * @apiGroup Group
 * 
 * @apiSuccess {String[]} categories List of unique categories.
 */
app.get('/categories', async (req, res) => {
  try {
    // Use a raw query to fetch distinct categories from the "Group" table
    const [categories] = await Group.sequelize.query(
      'SELECT DISTINCT "category" FROM "Group" WHERE "category" IS NOT NULL'
    );
    const categoryList = categories.map(c => c.category);
    res.status(200).json(categoryList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

app.post('/getGroupsByBusinessEmail', async (req, res) => {
  try {
    console.log('getGroupsByBusinessEmail');
    const accessToken = req.headers.authorization.split(' ')[1];
    const { userEmail } = await validate(accessToken);
    const { businessEmail, page = 1, limit = 10 } = req.body;
    const groups = await getBusinessGroups(businessEmail, page, limit);
    res.status(200).json(groups);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      res.status(401).json({ message: 'Unauthorized', error: error.message });
    } else {
      res.status(400).json({ message: 'Error fetching groups by business email', error: error.message });
    }
  }
});
};