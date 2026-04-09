const express = require('express');
const { getPatients, getPatient, addPatientReport } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all patients (Doctor only)
router.get('/patients', protect, authorize('doctor'), getPatients);

// Get specific patient (Doctor or self)
router.get('/patients/:id', protect, getPatient);

// Add a report to a patient (Doctor only)
router.post('/patients/:id/reports', protect, authorize('doctor'), addPatientReport);

module.exports = router;
