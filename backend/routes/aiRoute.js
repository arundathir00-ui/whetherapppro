const express = require('express');
const { generatePlan } = require('../controllers/aiController');
const router = express.Router();

router.post('/generate-plan', generatePlan);

module.exports = router;
