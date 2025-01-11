const User = require('../data/models/user');
const Business = require('../data/models/business');
const { register, getUser, registerBusiness } = require('../domain/user');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    console.log('User service received request to /register');
    try {
      const { name, password, email, phone, state, city, street, streetNumber, zipCode } = req.body;
      console.log('Request body:', req.body);

      const newUser = await register({ name, password, email, phone, state, city, street, streetNumber, zipCode });
      //console.log('New user registered:', newUser);

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      //console.error('Error registering user:', error);
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }
  });

  app.post('/registerBusiness', async (req, res) => {
    console.log('User service received request to /registerBusiness');
    try {
      const { username, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail } = req.body;
      //console.log('Request body:', req.body);

      const newBusiness = await registerBusiness({ username, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail });
      //console.log('New business registered:', newBusiness);

      res.status(201).json({ message: 'Business registered successfully', business: newBusiness });
    } catch (error) {
      //console.error('Error registering business:', error);
      res.status(400).json({ message: 'Error registering business', error: error.message });
    }
  });

  app.get('/me', async (req, res) => {
    console.log('User service received request to /users/me');
    
    try {
      const authHeader = req.headers['authorization']; // Get the header
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.split(' ')[1]; // Extract token part
        const user = await getUser(accessToken);
        res.status(200).json({ user });
      }

      
    } catch (error) {
      //console.error('Error fetching user:', error);
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  });
};

