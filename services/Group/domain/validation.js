const e = require("express");

const validate = async (accessToken) => {
    //call auth api and recive username if token is valid
    //const response = await fetch('http://localhost:3000/auth/validate-token')
    let userEmail = "a.a@com"
    if (userEmail) {
        return {userEmail};
    }
    throw error('Invalid token');
    
}

module.exports = { validate };