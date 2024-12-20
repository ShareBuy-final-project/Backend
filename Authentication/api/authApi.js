const User = require('../data/models/User');
const { register, getUser } = require('../domain/auth');

module.exports = (app) => {
app.post('/login', async (req, res) => {
    try {
        const user = await getUser(req.body);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Assuming generateToken is a function that generates a JWT token
        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/validate-token', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        // Assuming verifyToken is a function that verifies a JWT token
        const decoded = verifyToken(token);
        res.status(200).json(decoded);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
}

