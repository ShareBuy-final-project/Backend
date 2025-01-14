const { User, Business } = require('models');
const { register, getUser, registerBusiness } = require('../domain/user');

module.exports = (app) => {
  /**
   * @api {post} /register Register a new user
   * @apiName RegisterUser
   * @apiGroup User
   * 
   * @apiParam {String} fullName User's full name
   * @apiParam {String} password User's password
   * @apiParam {String} email User's email
   * @apiParam {String} phone User's phone number
   * @apiParam {String} state User's state
   * @apiParam {String} city User's city
   * @apiParam {String} street User's street
   * @apiParam {String} streetNumber User's street number
   * @apiParam {String} zipCode User's zip code
   * 
   * @apiSuccess {String} message Success message
   * @apiSuccess {Object} user Registered user object
   */
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

  /**
   * @api {post} /registerBusiness Register a new business
   * @apiName RegisterBusiness
   * @apiGroup Business
   * 
   * @apiParam {String} fullName User's full name
   * @apiParam {String} password User's password
   * @apiParam {String} email User's email
   * @apiParam {String} phone User's phone number
   * @apiParam {String} state User's state
   * @apiParam {String} city User's city
   * @apiParam {String} street User's street
   * @apiParam {String} streetNumber User's street number
   * @apiParam {String} zipCode User's zip code
   * @apiParam {String} businessName Business name
   * @apiParam {String} businessNumber Business number
   * @apiParam {String} description Business description
   * @apiParam {String} category Business category
   * @apiParam {String} websiteLink Business website link
   * @apiParam {String} contactEmail Business contact email
   * 
   * @apiSuccess {String} message Success message
   * @apiSuccess {Object} business Registered business object
   */
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

  /**
   * @api {get} /me Get current user details
   * @apiName GetUser
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization User's access token
   * 
   * @apiSuccess {Object} user User object without password
   */
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

  /**
   * @api {post} /update Update user details
   * @apiName UpdateUser
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization User's access token
   * 
   * @apiParam {String} fullName User's full name
   * @apiParam {String} email User's email
   * @apiParam {String} phone User's phone number
   * @apiParam {String} state User's state
   * @apiParam {String} city User's city
   * @apiParam {String} street User's street
   * @apiParam {String} streetNumber User's street number
   * @apiParam {String} zipCode User's zip code
   * 
   * @apiSuccess {String} message Success message
   */
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

  /**
   * @api {post} /change-password Change user password
   * @apiName ChangePassword
   * @apiGroup User
   * 
   * @apiHeader {String} Authorization User's access token
   * 
   * @apiParam {String} currentPassword User's current password
   * @apiParam {String} newPassword User's new password
   * 
   * @apiSuccess {String} message Success message
   */
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

