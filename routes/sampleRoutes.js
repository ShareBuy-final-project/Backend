const express = require('express');
const { getSamples, createSample } = require('../controllers/sampleController');
const router = express.Router();

router.get('/', getSamples);
router.post('/', createSample);

module.exports = router;
