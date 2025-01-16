const { Group, User, SavedGroup, GroupUser } = require('models');
const { validate } = require('./validation');
const { Op } = require('sequelize');

const create = async ({ name, accessToken, details, image, price, discount, size }) => {
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
      name, creator: userEmail, description: details, image, price, discount, size
    };
    console.log(obj);
    const newGroup = new Group(obj);

    await newGroup.save();

    return newGroup;
  } catch (error) {
    throw new Error(error.toString());
  }
}

const getGroup = async (id) => {
  try {
    const group = await Group.findOne({ id });
    return group;
  } 
  catch (error) {
    throw new Error('Invalid id');
  }
}

const getGroupsWithSavedStatus = async ({ page, limit, userEmail }) => {
  const offset = (page - 1) * limit;
  const groups = await Group.findAll({ offset, limit });

  const savedGroups = await SavedGroup.findAll({ where: { userEmail } });
  const savedGroupIds = savedGroups.map(sg => sg.groupId);

  const groupsWithTotalAmount = await Promise.all(groups.map(async group => {
    const totalAmount = await GroupUser.sum('amount', { where: { groupId: group.id } });
    return {
      ...group.toJSON(),
      isSaved: savedGroupIds.includes(group.id),
      totalAmount
    };
  }));

  return groupsWithTotalAmount;
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

const joinGroup = async ({ groupId, userEmail, amount }) => {
  await checkGroupExists(groupId);
  await GroupUser.create({ groupId, userEmail, amount });
};

const leaveGroup = async ({ groupId, userEmail }) => {
  await checkGroupExists(groupId);
  await GroupUser.destroy({ where: { groupId, userEmail } });
};

const searchGroups = async ({ name, page, limit }) => {
  const offset = (page - 1) * limit;
  const groups = await Group.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    },
    offset,
    limit
  });

  return groups;
};

module.exports = {
  create, getGroup, getGroupsWithSavedStatus, saveGroup, joinGroup, leaveGroup, checkGroupExists, searchGroups
};