const { User, Business, RefreshToken } = require('models');
const { verifyTokenJWT, generateToken, refreshTokenJWT, generateRefreshToken } = require('../utils/jwt');
const { comparePassword } = require('../domain/utils');

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
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Invalid credentials');
        const isMatch = await comparePassword(user, password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = generateToken(email);
        const refreshUserToken = generateRefreshToken(email);
        const newRefreshUserToken = new RefreshToken({
            email,
            token:refreshUserToken,
          });
        
          await newRefreshUserToken.save();
        
        const business = await Business.findOne({ where: { userEmail: email } });
        const isBusiness = !!business;

        console.log('Logged in successfully');
        return { token, refreshUserToken, isBusiness };
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
const logout = async (token) => {
    await RefreshToken.destroy({ where: { token } });
};

/**
 * Refreshes the access token using the provided refresh token.
 * @param {string} token - The refresh token.
 * @returns {string} - The new access token.
 * @throws {Error} - If the refresh token is invalid.
 */
const refreshAccessToken = async (token) => {
    try {
        console.log('refresh jwt-1-1-1-1-1', token);
        if (!token) throw new Error('No token provided');
        if (RefreshToken.findOne({ where: { token } }) === null) throw new Error('Invalid token');
        console.log('refresh jwt-2-2-2-2-2', token);
        const newAccessToken = refreshTokenJWT(token);
        console.log('refresh jwt-3-3-3-3-3', token);
        return newAccessToken;
    } catch (err) {
        throw new Error("Error refreshing token ", err);
    }
};

module.exports = {
    verifyToken,
    login,
    logout,
    refreshAccessToken,
};