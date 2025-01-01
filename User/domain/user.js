const bcrypt = require('bcrypt');
const User = require('../data/models/user');
const Business = require('../data/models/business');
const { validate } = require('./validation');

const register = async ({ username, password, email, phone, state, city, street, streetNumber, zipCode }) => {
  if (!username || !password || !email || !phone || !state || !city || !street || !streetNumber) {
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    phone,
    state,
    city,
    street,
    streetNumber,
    zipCode,
  });

  await newUser.save();

  return newUser;
};

const getUser = async (accessToken) => {
  try {
    const { userEmail } = validate(accessToken);
    const user = await User.findOne({ where: { email: userEmail } });
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const registerBusiness = async (businessDetails) => {
  const { username, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail } = businessDetails;

  const newUser = await User.create({ username, password, email, phone, state, city, street, streetNumber, zipCode });
  const newBusiness = await Business.create({ businessName, businessNumber, description, category, websiteLink, contactEmail, userId: newUser.id });

  return { user: newUser, business: newBusiness };
};

module.exports = {
  register,
  getUser,
  registerBusiness,
};