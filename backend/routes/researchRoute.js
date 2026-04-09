const express = require('express');
const { fetchResearchContext } = require('../controllers/researchController');
const router = express.Router();

router.post('/context', fetchResearchContext);

module.exports = router;
