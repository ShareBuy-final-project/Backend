const { User, Business } = require('models');
const { register, getUser, registerBusiness } = require('../domain/user');

module.exports = (app) => {
  app.post('/register', async (req, res) => {
    console.log('User service received request to /register');
    console.log('Request body:', req.body);
    try {
      const { fullName, password, email, phone, state, city, street, streetNumber, zipCode } = req.body;
      console.log('Parsed request body:', { fullName, password, email, phone, state, city, street, streetNumber, zipCode });

      const newUser = await register({ fullName, password, email, phone, state, city, street, streetNumber, zipCode });
      //console.log('New user registered:', newUser);

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }
  });

  app.post('/registerBusiness', async (req, res) => {
    console.log('User service received request to /registerBusiness');
    try {
      const { fullName, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail } = req.body;
      //console.log('Request body:', req.body);

      const newBusiness = await registerBusiness({ fullName, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail });
      //console.log('New business registered:', newBusiness);

      res.status(201).json({ message: 'Business registered successfully', business: newBusiness });
    } catch (error) {
      //console.error('Error registering business:', error);
      res.status(400).json({ message: 'Error registering business', error: error.message });
    }
  });

  app.get('/me', async (req, res) => {
    console.log('User service received request to /me');
    try {
      //console.log('Authorization header:', req.headers.authorization);
      const accessToken = req.headers.authorization.split(' ')[1];
      const user = await getUser(accessToken);

      //console.log('User:', user);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...userData } = user.dataValues;
      //console.log('User data returned:', userData);
      res.status(200).json(userData);
    } catch (error) {
      if (error.message === 'Invalid token') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.error('Error fetching user:', error);
      res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
  });

  app.post('/update', async (req, res) => {
    console.log('User service received request to /update');
    try {
      const { fullName, email, phone, state, city, street, streetNumber, zipCode } = req.body;
      const accessToken = req.headers.authorization.split(' ')[1];
      const user = await getUser(accessToken);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      user.fullName = fullName;
      user.email = email;
      user.phone = phone;
      user.state = state;
      user.city = city;
      user.street = street;
      user.streetNumber = streetNumber;
      user.zipCode = zipCode;

      await user.save();
      res.status(200).json({ message: 'Update successful' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ message: 'Error updating user', error: error.message });
    }
  });

  app.post('/change-password', async (req, res) => {
    console.log('User service received request to /change-password');
    try {
      const { currentPassword, newPassword } = req.body;
      const accessToken = req.headers.authorization.split(' ')[1];
      const user = await getUser(accessToken);

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: 'Password change successful' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(400).json({ message: 'Error changing password', error: error.message });
    }
  });
};

