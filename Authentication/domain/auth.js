const User = require('../data/models/userTest');
const {verifyTokenJWT, generateToken, refreshTokenJWT, generateRefreshToken} = require('../utils/jwt');

let refreshTokens = []

const verifyToken = (token) => {
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = verifyTokenJWT(token);
        return decoded;
    } catch (err) {
        throw new Error('Invalid token');
    }
}

const login = async ({email, password}) => {
    try {
        const user = await User.findOne(email);
        if (!user) throw new Error('Invalid credentials');
        const isMatch = await User.comparePassword(password);
        if (!isMatch) throw new Error('Invalid credentials');
        const token = generateToken(email);
        const refreshUserToken = generateRefreshToken(email);
        refreshTokens.push(refreshUserToken);
        return {token, refreshUserToken};
    } catch (err) {
        throw new Error('Error logging in');
    }
};

const refreshToken = async (token) => {
    try{
        if (!token) throw new Error('No token provided');
        if (!refreshTokens.includes(token)) throw new Error('Invalid token');
        return refreshTokenJWT(token);
    } 
    catch(err){
        throw new Error(err);
    }
}

module.exports = {
    login, verifyToken, refreshToken
  };