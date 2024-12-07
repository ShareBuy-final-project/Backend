const express = require('express');

const router = express.Router();

// POST /user register
router.post('/', (req, res) => {
    // Handle register logic
    console.log("user register request has been made")
    res.send(`register request has been received`);
  });

module.exports = router;