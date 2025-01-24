const { Group, User, SavedGroup, GroupUser, Business } = require('models');
const { validate } = require('./validation');
const { Op } = require('sequelize');
const axios = require('axios');
require('dotenv').config();

const getTotalAmount = async (id) =>{ 
  await GroupUser.sum('amount', { where: { groupId: id, paymentConfirmed: true  } }
)};

const create = async ({ name, creator, description, image, price, discount, size, category, businessNumber }) => {
  if (!name || !price || !discount || !size || !category || !businessNumber) {
    throw new Error('Missing required fields');
  }
  // const existingGroup = await Group.findOne({ where: { name } });
  // if (existingGroup) {
  //   throw new Error('Name already exists');
  // }



  try {
    const newGroup = await Group.create({
      name,
      creator,
      description,
      image,
      price,
      discount,
      size,
      category,
      businessNumber
    });

    return newGroup;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getGroup = async (id) => {
  try {
    const group = await Group.findOne({where: {id} });
    totalAmount = await getTotalAmount(id);
    group.totalAmount = totalAmount;
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
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };
  const body = {groupId, amount}
  const response = await axios({
    method: 'post',
    url: `${process.env.GATE_WAY_URL}/payment/paymentIntent`,
    headers: headers,
    data: body
  });
  const { paymentIntentId } = response.data;

  await GroupUser.create({ groupId, userEmail, amount, paymentIntentId});
  return response;
};

const leaveGroup = async ({ groupId, userEmail }) => {
  await checkGroupExists(groupId);
  await GroupUser.destroy({ where: { groupId, userEmail } });
};

const searchGroups = async ({ filters, page, limit, userEmail }) => {
  const offset = (page - 1) * limit;
  const whereClause = {};

  if (filters.text) {
    whereClause.name = { [Op.iLike]: `%${filters.text}%` };
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
    const totalAmount = await getTotalAmount(group.groupId);
    const { description, category, creator, image, ...groupData } = group.toJSON();

    // Convert BLOB to base64 string if image exists
    const imageBase64 = image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;

    return {
      ...groupData,
      isSaved: savedGroupIds.includes(group.id),
      totalAmount,
      imageBase64
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