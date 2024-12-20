const User = require('../data/models/user');
const { register, getUser } = require('../domain/user');

module.exports = (app) => {
  app.post('/users/register', async (req, res) => {// Implemnt function by calling the function register from 'domain/user'
    try {
      const { username, password, email } = req.body;
  
      // Call the register function from 'domain/user'
      const newUser = await register({ username, password, email });
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
      console.log('User registered successfully');
    } catch (error) {
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }  
  });
  
  app.get('/users/me', async (req, res) => {
    try {
      const { accessToken } = req.body;
      const user = await getUser(accessToken);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  });
};

