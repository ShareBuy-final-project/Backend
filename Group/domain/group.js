const Group = require('../data/models/group');
const create = async ({ name, user, details, image,price,discount,size }) => {
    if (!name || !price || !discount || !size) {
        throw new Error('Missing required fields');
    }
    const existingGroup = await Group.findOne({ where: { name } });
    if (existingGroup) {
        throw new Error('name already exists');
    }
    const user = await User.findOne({ where: { userEmail:user } });
    if (!user) {
        throw new Error("user doesn't exist");
    }
    const newGroup = new Group({
        name, user, details, image,price,discount,size
      });
    
      await newGroup.save();
    
      return newGroup;
}
const getGroup = async (id) => {
    try{
      const group = await Group.findOne({id});
      return group;
    }
    catch(error){
      throw new Error('Invalid id');
    }
  }
  
  module.exports = {
    create, getGroup
  };