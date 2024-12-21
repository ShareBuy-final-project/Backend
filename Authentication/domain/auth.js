const user = require('../data/models/userTest');
const {verifyTokenJWT, generateToken} = require('../utils/jwt');

const verifyToken = (token) => {
    //verify token
}
const login = async ({email, password}) => {
    try {
        console.log('email', email);
        console.log('password', password)
        const usera = await user.findOne(email);
        if (!usera) return res.status(404).json({ message: 'User not found' });
        console.log('user', usera);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        console.log('isMatch', isMatch);
        const token = generateToken(usera._id);
        return token;
    } catch (err) {
        console.log('error', err);
        throw new Error('Error logging in');
    }
};
module.exports = {
    login, verifyToken
  };