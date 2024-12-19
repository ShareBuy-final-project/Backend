// const bcrypt = require('bcrypt');
const User = require('../data/models/User');

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

module.exports = {
  register,
};