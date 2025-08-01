const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');

// Multer config: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to get GridFS bucket
function getGridFSBucket(bucketName = 'user_photos') {
  return new GridFSBucket(mongoose.connection.db, { bucketName });
}

// Middleware: upload user image to GridFS and set req.uploadedFileId
const uploadImageToGridFS = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const bucket = getGridFSBucket('user_photos');
    const filename = `${Date.now()}_${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { originalName: req.file.originalname }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      req.uploadedFileId = uploadStream.id;
      next();
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ message: 'Image upload failed', error: err.message });
    });
  } catch (err) {
    console.error('GridFS error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

// Middleware: upload report image to GridFS and set req.uploadedFileId
const uploadImageToGridFSForReport = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const bucket = getGridFSBucket('uploads');
    const filename = `${Date.now()}_${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { originalName: req.file.originalname }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      req.uploadedFileId = uploadStream.id;
      next();
    });

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      res.status(500).json({ message: 'Image upload failed', error: err.message });
    });
  } catch (err) {
    console.error('GridFS error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
};

module.exports = { upload, uploadImageToGridFS, uploadImageToGridFSForReport, getGridFSBucket };