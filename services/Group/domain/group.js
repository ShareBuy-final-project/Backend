const { Group, User, SavedGroup, GroupUser } = require('models');
const { validate } = require('./validation');
const { Op } = require('sequelize');
const axios = require('axios');
require('dotenv').config();

const create = async ({ name, accessToken, details, image, price, discount, size, category }) => {
  if (!name || !price || !discount || !size) {
    throw new Error('Missing required fields');
  }
  const existingGroup = await Group.findOne({ where: { name } });
  if (existingGroup) {
    throw new Error('name already exists');
  }

  try {
    let { userEmail } = await validate(accessToken);
    let obj = {
      name, creator: userEmail, description: details, image, price, discount, size, category
    };
    console.log(obj);
    const newGroup = new Group(obj);

    await newGroup.save();

    return newGroup;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getGroup = async (id) => {
  try {
    const group = await Group.findOne({where: {id} });
    return group;
  } 
  catch (error) {
    throw new Error('Invalid id');
  }
};

const saveGroup = async ({ userEmail, groupId }) => {
  try {
    const existingSavedGroup = await SavedGroup.findOne({ where: { userEmail, groupId } });
    if (existingSavedGroup) {
      throw new Error('Group already saved');
    }

    const newSavedGroup = new SavedGroup({ userEmail, groupId });
    await newSavedGroup.save();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const checkGroupExists = async (groupId) => {
  const group = await Group.findByPk(groupId);
  if (!group) {
    throw new Error('Group does not exist');
  }
};

const joinGroup = async ({accessToken ,groupId, userEmail, amount }) => {
  await checkGroupExists(groupId);
  console.log('checked group exists');
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };
  const body = {groupId, amount}
  console.log('body', body);
  const response = await axios({
    method: 'post',
    url: `${process.env.GATE_WAY_URL}/payment/paymentIntent`,
    headers: headers,
    data: body
  });
  console.log('response', response.data);
  const { paymentIntent } = response.data;
  await GroupUser.create({ groupId, userEmail, amount, paymentIntent});
  return response;
};

const leaveGroup = async ({ groupId, userEmail }) => {
  await checkGroupExists(groupId);
  await GroupUser.destroy({ where: { groupId, userEmail } });
};

const searchGroups = async ({ filters, page, limit, userEmail }) => {
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (filters.name) {
    whereClause.name = { [Op.like]: `%${filters.name}%` };
  }
  if (filters.category) {
    whereClause.category = filters.category;
  }
  if (filters.price) {
    whereClause.price = { [Op.lte]: filters.price };
  }
  // Add more filters as needed

  console.log('where clause', whereClause);
  const groups = await Group.findAll({
    where: whereClause,
    offset,
    limit
  });

  const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
  const savedGroupIds = savedGroups.map(sg => sg.groupId);
  console.log('savedGroupIds', savedGroupIds);

  const groupsWithTotalAmount = await Promise.all(groups.map(async group => {
    const totalAmount = await GroupUser.sum('amount', { where: { groupId: group.id } });
    const { description, category, creator, ...groupData } = group.toJSON();
    return {
      ...groupData,
      isSaved: savedGroupIds.includes(group.id),
      totalAmount
    };
  }));
  //console.log('groupsWithTotalAmount', groupsWithTotalAmount);

  return groupsWithTotalAmount;
};

const getSavedGroups = async ({ userEmail, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const savedGroups = await SavedGroup.findAll({ where: { userEmail }, offset, limit });
  const groupIds = savedGroups.map(sg => sg.groupId);
  const groups = await Group.findAll({ where: { id: groupIds } });
  return groups;
};

const getBusinessHistory = async (userEmail, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const business = await Business.findOne({ where: { userEmail } });

    if (!business) {
      return { message: 'User does not have an associated business' };
    }

    const groups = await Group.findAll({
      where: {
        businessNumber: business.businessNumber,
        purchaseMade: true
      },
      offset,
      limit
    });

    return groups;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getUserHistory = async (userEmail, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const groupUsers = await GroupUser.findAll({ where: { userEmail } });
    const groupIds = groupUsers.map(gu => gu.groupId);

    const groups = await Group.findAll({
      where: {
        id: groupIds,
        purchaseMade: true
      },
      offset,
      limit
    });

    return groups;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getUserGroups = async (userEmail, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const groupUsers = await GroupUser.findAll({ where: { userEmail } });
    const groupIds = groupUsers.map(gu => gu.groupId);

    const groups = await Group.findAll({
      where: {
        id: groupIds,
        purchaseMade: false,
        isActive: true
      },
      offset,
      limit
    });

    return groups;
  } catch (error) {
    throw new Error(error.toString());
  }
};

module.exports = {
  create, getGroup, saveGroup, joinGroup, leaveGroup, checkGroupExists, searchGroups, getBusinessHistory, getSavedGroups, getUserHistory, getUserGroups
};