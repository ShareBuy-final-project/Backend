const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    try{
        console.log('userId', userId);  
        const token = jwt.sign(
            { userId: userId },  // payload
            process.env.JWT_SECRET,  // secret key
            { 
                expiresIn: '24h'  // token expiration time
            }
        );
        return token;
        
    }
    catch(err){
        throw new Error(err);
    }
};

const verifyTokenJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyTokenJWT };
