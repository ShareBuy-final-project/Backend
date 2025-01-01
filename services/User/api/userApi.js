const User = require('../data/models/user');
const { register, getUser } = require('../domain/user');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    console.log('User service received request to /register');
    try {
      const { username, password, email } = req.body;
      //console.log('Request body:', req.body);

      const newUser = await register({ username, password, email });
      //console.log('New user registered:', newUser);

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      //console.error('Error registering user:', error);
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }
  });

  app.get('/me', async (req, res) => {
    console.log('User service received request to /users/me');
    try {
      const { accessToken } = req.body;
      //console.log('Request body:', req.body);

      const user = await getUser(accessToken);
      //console.log('Fetched user:', user);

      res.status(200).json(user);
    } catch (error) {
      //console.error('Error fetching user:', error);
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  });
};

