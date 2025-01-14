const { Group, User, SavedGroup } = require('models');
const { validate } = require('./validation');

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

  return groups.map(group => ({
    ...group.toJSON(),
    isSaved: savedGroupIds.includes(group.id)
  }));
};

module.exports = {
  create, getGroup, getGroupsWithSavedStatus
};