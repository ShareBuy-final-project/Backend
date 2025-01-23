
const validate = async (accessToken) => {
    console.log('--------------------------------------------------------------------')
    console.log(`Sending request to validate token: ${accessToken}`);
    try {
        console.log('Sending request to validation service');
        const response = await fetch('http://132.73.84.56:443/auth/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log("Received response from validation service");
        console.log("response", response);
        if (response.status === 200) {
            console.log('Token validated successfully');
            return { userEmail: response.data.data.email };
        }
        else{
            throw new Error('status code not 200');
        }
    } catch (error) {
        console.log("Error validating token");
        console.error('Error validating token:', error.message);
        throw new Error('Invalid token 123 123');
    }
}

module.exports = { validate };
