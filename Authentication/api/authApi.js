const { login, logout, verifyToken, refreshToken } = require('../domain/auth');

module.exports = (app) => {
  /**
   * Handles user login.
   * Input: req - The request body containing email and password.
   *        res - The response object.
   * What it does: Authenticates the user and returns access and refresh tokens.
   * Response: JSON object containing accessToken and refreshToken.
   */
  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const { token, refreshUserToken } = await login({ email, password });
      res.status(200).json({ accessToken: token, refreshToken: refreshUserToken });
    } catch (error) {
      res.status(400).json({ message: 'Error logging in', error: error.message });
    }
  });

  /**
   * Logs out a user by invalidating the provided refresh token.
   * Input: req - The request body containing the refresh token.
   *        res - The response object.
   * What it does: Invalidates the refresh token by deleting it from db.
   * Response: JSON object with a success message.
   */
  app.delete('/auth/logout', async (req, res) => {
    try {
      const token = req.body.token;
      logout(token);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error logging out', error: err.message });
    }
  });

  /**
   * Validates the provided access token.
   * Input: req - The request containing the access token in the Authorization header.
   *        res - The response object.
   * What it does: Verifies the access token.
   * Response: JSON object indicating whether the token is valid and the decoded token data- email of the user.
   */
  app.get('/auth/validate-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      res.status(200).json({ valid: true, data: decoded });
    } catch (error) {
      res.status(400).json({ valid: false, message: 'Invalid token', error: error.message });
    }
  });

  /**
   * Refreshes the access token using the provided refresh token.
   * Input: req - The request containing the refresh token.
   *        res - The response object.
   * What it does: Generates a new access token.
   * Response: JSON object containing the new access token.
   */
  app.post('/auth/token', async (req, res) => {
    console.log('refresh token');
    try {
      const { token } = req.body;
      const newToken = await refreshToken(token);
      res.status(200).json({ accessToken: newToken });
    } catch (err) {
      res.status(400).json({ message: 'Error refreshing token', error: err.message });
    }
  });
};
