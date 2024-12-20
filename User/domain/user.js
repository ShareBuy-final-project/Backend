// const bcrypt = require('bcrypt');
const User = require('../data/models/user');
const {validate} = require('./validation');

const register = async ({ username, password, email }) => {

  if (!username || !password || !email) {
    throw new Error('All fields are required');
  }

//   const existingUser = await User.findOne({ username });
//   if (existingUser) {
//     throw new Error('Username already exists');
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newUser = new User({
//     username,
//     password: hashedPassword,
//     email,
//   });

//   await newUser.save();

  return {
    username,
    email,  
  };
};

const getUser = async (accessToken) => {
  try{
    const {userEmail} = validate(accessToken);
    const user = await User.findOne({email: userEmail});
    return user;
  }
  catch(error){
    throw new Error('Invalid token');
  }
}

module.exports = {
  register, getUser
};