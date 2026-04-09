const User = require('../models/User');

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private/Doctor
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single patient by ID
// @route   GET /api/users/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    // Basic authorization checking
    if (req.user.role === 'patient' && req.user.id !== req.params.id) {
       return res.status(403).json({ success: false, error: 'Cannot access other patient records' });
    }

    const patient = await User.findOne({ _id: req.params.id, role: 'patient' }).select('-password');
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add a report to a patient
// @route   POST /api/users/patients/:id/reports
// @access  Private/Doctor
exports.addPatientReport = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: 'patient' });
    
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const newReport = {
      title: req.body.title,
      details: req.body.details,
      authorId: req.user.id,
      sbar: req.body.sbar || {}
    };

    patient.reports.push(newReport);
    await patient.save();

    res.status(201).json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
