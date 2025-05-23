const axios = require('axios');

const validate = async (accessToken) => {
    console.log(`Sending request to validate token: ${accessToken}`);
    try {
        const response = await axios.get('http://132.73.84.56:443/auth/validate-token', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            console.log('Token validated successfully');
            return { userEmail: response.data.data.email };
        }
    } catch (error) {
        console.error('Error validating token:', error.message);
        throw error;
    }
}

module.exports = { validate };