const { login, verifyToken, refreshToken} = require('../domain/auth');

module.exports = (app) => {
    app.post('/auth/login', async (req, res) => {
        const {email, password} = req.body;
        try {
            const {token, refreshUserToken} = await login({email, password});
            res.status(200).json({accessToken: token, refreshToken: refreshUserToken});
        } catch (error) {
            res.status(400).json({ message: 'Error logging in', error: error.message });
        }
    });

    app.get('/auth/validate-token', (req, res,next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token)
            res.status(200).json({valid:true, data:decoded});
        }
        catch(error) {
            res.status(400).json({valid:false, message: 'Invalid token', error: error.message });
        }
    });

    app.get('/auth/token', async (req, res) => {
        try {
            const token = req.body.token;
            const newToken = await refreshToken(token);
            res.status(200).json({accessToken: newToken});
        }
        catch(err){
            res.status(400).json({ message: 'Error refreshing token', error: err.message});
        }
    });
}

