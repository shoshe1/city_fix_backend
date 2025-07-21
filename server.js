const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://shahd:shahd123@cityfix.hkh0eim.mongodb.net/?retryWrites=true&w=majority&appName=cityFix';

// Connect to MongoDB
mongoose.connect(mongoURI)

.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
