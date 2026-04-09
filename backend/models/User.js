const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    required: true
  },
  // Base fields shared among roles
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  
  // PATIENT SPECIFIC FIELDS
  age: {
    type: Number,
    required: function() { return this.role === 'patient'; }
  },
  weight: { // in kg
    type: Number, 
    required: function() { return this.role === 'patient'; }
  },
  height: { // in cm
    type: Number,
    required: function() { return this.role === 'patient'; }
  },
  medicalHistory: [{
    type: String
  }],
  reports: [{
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    details: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sbar: {
      situation: String,
      background: String,
      assessment: String,
      recommendation: String
    }
  }],

  // DOCTOR SPECIFIC FIELDS
  specialty: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  department: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
