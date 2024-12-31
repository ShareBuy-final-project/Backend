const Group = require('../data/models/group');
const {validate} = require('./validation');
const create = async ({ name, accessToken, details, image,price,discount,size }) => {
    if (!name || !price || !discount || !size) {
        throw new Error('Missing required fields');
    }
    const existingGroup = await Group.findOne({ where: { name } });
    if (existingGroup) {
        throw new Error('name already exists');
    }
    try{
      const {userEmail} = validate(accessToken);
      var user = await User.findOne({email: userEmail});
    }
    catch(error){
      throw new Error('Invalid token');
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