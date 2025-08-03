const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userroutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationroutes');
const {GridFSBucket} = require('mongodb');
const env = require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.get('/api/images/:id', async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'user_photos' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on('error', () => res.status(404).json({ message: 'Image not found' }));
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving image' });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
// MongoDB connection string

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend is working!',
    status: 'Server running successfully',
    endpoints: {
      users: '/api/users'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Users API: http://localhost:${PORT}/api/users`);
  console.log(`🌐 Test: http://localhost:${PORT}/`);
});
