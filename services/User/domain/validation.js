const e = require("express");
const axios = require('axios');

const validate = async (accessToken) => {
    try {
        const response = await axios.get('http://api-gateway/validate-token', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return { userEmail: response.data.data.email };
        }
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = { validate };
