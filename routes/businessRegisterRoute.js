const express = require('express');

const router = express.Router();

// POST /business register
router.post('/', (req, res) => {
    // Handle register logic
    console.log("business register request has been made")
    res.send(`business register request has been received`);
  });

module.exports = router;