const { User } = require('models');
const { verifyTokenJWT, generateToken, refreshTokenJWT, generateRefreshToken } = require('../utils/jwt');

let refreshTokens = [];

/**
 * Verifies the provided access token.
 * @param {string} token - The access token to verify.
 * @returns {object} - The decoded token data.
 * @throws {Error} - If the token is invalid.
 */
const verifyToken = (token) => {
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = verifyTokenJWT(token);
        return decoded;
    } catch (err) {
        throw new Error('Invalid token');
    }
};

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {accesToken, refreshToken} - The access token and refresh token.
 * @throws {Error} - If the login fails.
 */
const login = async ({ email, password }) => {
    try {
        console.log('Logging in user');
        const user = await User.findOne(email);
        console.log('user', user);
        if (!user) throw new Error('Invalid credentials');
        const isMatch = await User.comparePassword(password);
        if (!isMatch) throw new Error('Invalid credentials');
        console.log('User logged in successfully');
        const token = generateToken(email);
        console.log('token', token);
        const refreshUserToken = generateRefreshToken(email);
        console.log('refreshUserToken', refreshUserToken);
        // RefreshToken.create({ email, token: refreshUserToken });
        refreshTokens.push(refreshUserToken);
        console.log('Logged in successfully');

        return { token, refreshUserToken };
    } catch (err) {
        console.log('Error logging in', err);
        throw new Error('Error logging in');
    }
};

/**
 * Logs out a user by invalidating the provided refresh token.
 * @param {string} token - The refresh token to invalidate.
 * @throws {Error} - If no token is provided.
 */
const logout = (token) => {
    if (!token) throw new Error('No token provided');
    // RefreshToken.destroy({ where: { token } });
    refreshTokens = refreshTokens.filter(t => t !== token);
};

/**
 * Refreshes the access token using the provided refresh token.
 * @param {string} token - The refresh token.
 * @returns {string} - The new access token.
 * @throws {Error} - If the refresh token is invalid.
 */
const refreshToken = async (token) => {
    try {
        if (!token) throw new Error('No token provided');
        // if (RefreshToken.findOne({ where: { token } }) === null) throw new Error('Invalid token');
        if (!refreshTokens.includes(token)) throw new Error('Invalid token');
        const newAccessToken = refreshTokenJWT(token);
        return newAccessToken;
    } catch (err) {
        throw new Error("Error refreshing token ", err);
    }
};

module.exports = {
    verifyToken,
    login,
    logout,
    refreshToken,
};