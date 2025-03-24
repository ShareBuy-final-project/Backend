const { login, logout, verifyToken, refreshAccessToken } = require('../domain/auth');

module.exports = (app) => {
  /**
   * @api {post} /login User login
   * @apiName Login
   * @apiGroup Authentication
   * 
   * @apiBody {String} email User's email
   * @apiBody {String} password User's password
   * 
   * @apiSuccess {String} accessToken Access token
   * @apiSuccess {String} refreshToken Refresh token
   * 
   * Handles user login.
   * Input: req - The request body containing email and password.
   *        res - The response object.
   * What it does: Authenticates the user and returns access and refresh tokens.
   * Response: JSON object containing accessToken and refreshToken.
   */
  app.post('/login', async (req, res) => {
    console.log('login');
    const { email, password } = req.body;
    try {
      const { token, refreshUserToken, isBusiness } = await login({ email, password });
      res.status(200).json({ accessToken: token, refreshToken: refreshUserToken, isBusiness });
    } catch (error) {
      console.log('error logining in', error);
      res.status(400).json({ message: 'Error logging in', error: error.message });
    }
  });

  /**
   * @api {delete} /logout User logout
   * @apiName Logout
   * @apiGroup Authentication
   * 
   * @apiBody {String} token Refresh token
   * 
   * @apiSuccess {String} message Success message
   * 
   * Logs out a user by invalidating the provided refresh token.
   * Input: req - The request body containing the refresh token.
   *        res - The response object.
   * What it does: Invalidates the refresh token by deleting it from db.
   * Response: JSON object with a success message.
   */
  app.delete('/logout', async (req, res) => {
    console.log('logout');
    try {
      const token = req.body.token;
      await logout(token);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error logging out', error: err.message });
    }
  });

  /**
   * @api {get} /validate-token Validate access token
   * @apiName ValidateToken
   * @apiGroup Authentication
   * 
   * @apiHeader {String} Authorization Access token
   * 
   * @apiSuccess {Boolean} valid Token validity
   * @apiSuccess {Object} data Decoded token data
   * 
   * Validates the provided access token.
   * Input: req - The request containing the access token in the Authorization header.
   *        res - The response object.
   * What it does: Verifies the access token.
   * Response: JSON object indicating whether the token is valid and the decoded token data- email of the user.
   */
  app.get('/validate-token', (req, res) => {
    console.log('validate token');
    //console.log('Headers:', req.headers);
    const authHeader = req.headers['authorization'];
    //console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    //console.log('Token:', token);
    try {
      const decoded = verifyToken(token);
      res.status(200).json({ valid: true, data: decoded });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'Unauthorized', error: 'Unauthorized' });
    }
  });

  /**
   * @api {post} /token Refresh access token
   * @apiName RefreshToken
   * @apiGroup Authentication
   * 
   * @apiBody {String} token Refresh token
   * 
   * @apiSuccess {String} accessToken New access token
   * 
   * Refreshes the access token using the provided refresh token.
   * Input: req - The request containing the refresh token.
   *        res - The response object.
   * What it does: Generates a new access token.
   * Response: JSON object containing the new access token.
   */
  app.post('/token', async (req, res) => {
    console.log('refresh token');
    try {
      const { refreshToken } = req.body;
      const newToken = await refreshAccessToken(refreshToken);
      res.status(200).json({ accessToken: newToken });
    } catch (err) {
      res.status(400).json({ message: 'Error refreshing token', error: err.message });
    }
  });
};
