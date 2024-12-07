const express = require('express');

const router = express.Router();

// POST /login
// Define routes
router.post('/', (req, res) => {
    // Handle login logic
    console.log("login request has been made")
    const { username, password } = req.body;
    console.log(`Username: ${username}, Password: ${password}`);
    res.send(`${username}'s login request has been received`);
  });

module.exports = router;