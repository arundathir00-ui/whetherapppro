const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const aiRoutes = require('./routes/aiRoute');
const researchRoutes = require('./routes/researchRoute');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow the Vite frontend
  credentials: true
}));

// Route Definitions
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/research', researchRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'AegisFlow Backend Live', dbStatus: mongoose.connection.readyState });
});

// Final Error Handling Middleware Override
app.use(errorHandler);

// Database Connection
const PORT = process.env.PORT || 5000;
const { MongoMemoryServer } = require('mongodb-memory-server');

const bootServer = async () => {
  try {
    // Spin up the physical Mongo Instance inside RAM
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ In-Memory MongoDB Connected (Hackathon Mode)');
    
    // Auto-Seed Database for Hackathon Judges
    const hashed = await bcrypt.hash('password123', 10);
    const existingCheck = await User.countDocuments();
    if (existingCheck === 0) {
        await User.create({ email: 'doctor@aegis.com', password: hashed, role: 'doctor', firstName: 'Admin', lastName: 'Aris', specialty: 'Triage', department: 'ER' });
        await User.create({ email: 'patient@aegis.com', password: hashed, role: 'patient', firstName: 'Eleanor', lastName: 'Vance', age: 44, weight: 68, height: 165, medicalHistory: ['Hypertension'] });
        console.log('🌱 Database Auto-Seeded with Demo Accounts! (doctor@aegis.com / patient@aegis.com | pw: password123)');
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ In-Memory DB Boot Error:', err.message);
    process.exit(1);
  }
};

bootServer();
