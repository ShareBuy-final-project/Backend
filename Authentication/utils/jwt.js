const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (userEmail) => {
    try{
        const token = jwt.sign(
            { email: userEmail }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '15m'
            }
        );
        return token;
        
    }
    catch(err){
        throw new Error(err);
    }
};

const generateRefreshToken = (userEmail) => {
    try{
        const token = jwt.sign(
            { email: userEmail }, 
            process.env.REFRESH_TOKEN_SECRET,
        );
        return token;
    }
    catch(err){
        throw new Error(err);
    }
};

const refreshTokenJWT = (refreshToken) => {
    try{
        const decoded = verifyTokenJWT(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return generateToken(decoded.email);
    }
    catch(err){
        throw new Error(err);
    }
};

const verifyTokenJWT = (token, secret = process.env.JWT_SECRET) => {
    return jwt.verify(token, secret,(err, decoded) => {
        if (err) {
            throw new Error(err);
        }
        return decoded;
    });
};

module.exports = { generateToken, verifyTokenJWT, refreshTokenJWT, generateRefreshToken};
