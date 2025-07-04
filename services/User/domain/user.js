const bcrypt = require('bcrypt');
const { Business, User } = require('models');
const { validate } = require('./validation');

const register = async ({ fullName, password, email, phone, state, city, street, streetNumber, zipCode }) => {
  if (!fullName || !password || !email || !phone || !state || !city || !street || !streetNumber) {
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    fullName,
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

const getUser = async (userEmail) => {
  try {
    console.log('User email:', userEmail);
    const user = await User.findOne({ where: { email: userEmail } });
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const registerBusiness = async (businessDetails) => {
  const { fullName, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail } = businessDetails;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ fullName, password: hashedPassword, email, phone, state, city, street, streetNumber, zipCode });
  const newBusiness = await Business.create({ businessName, businessNumber, description, category, websiteLink, contactEmail, userEmail: email });

  return newBusiness;
};

module.exports = {
  register,
  getUser,
  registerBusiness,
};