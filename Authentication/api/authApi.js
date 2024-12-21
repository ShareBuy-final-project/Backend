const { login, verifyToken} = require('../domain/auth');

module.exports = (app) => {
    app.post('/auth/login', async (req, res) => {
        const {email, password} = req.body;
        try {
            const token = await login({email, password});
            res.status(200).json(token);
        } catch (error) {
            res.status(400).json({ message: 'Error logging in', error: error.message });
        }

    });

    app.get('/auth/validate-token', (req, res) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        try {
            const decoded = verifyToken(token);
            res.status(200).json(decoded);
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    });
}

