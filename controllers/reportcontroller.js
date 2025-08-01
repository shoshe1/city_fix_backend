const fs = require('fs-extra');
const Report = require('../models/report'); // Assuming the report model is in models/report.js
const User = require('../models/user');
const mongoose = require('mongoose');
const { uploadImageToGridFS } = require('../middleware/uploadMiddleware');
const { getGridFSBucket } = require('../middleware/uploadMiddleware'); // You should have a helper for GridFS bucket


// Create a new report
exports.createReport = async (req, res) => {
  try {
    let { description, issueType, location, user, user_id, user_name } = req.body;

    // Parse location if it's a JSON string
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }

    if (!description || !issueType || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let userId = user;
    // If user is provided, try to find the user and get user_id and user_name
    if (user) {
      const foundUser = await require('../models/user').findById(user);
      if (foundUser) {
        userId = foundUser._id;
        user_id = foundUser.user_id;
        user_name = foundUser.username;
      }
    }

    // Always save user, user_id, user_name (from request or DB)
    const newReport = new Report({
      description,
      issueType,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address
      },
      user: userId,
      user_id: user_id,
      user_name: user_name,
      images: req.uploadedFileId || undefined
    });

    await newReport.save();
    res.status(201).json({ message: 'Report created successfully', report: newReport });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getReportsbyuserid = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id); // if your user_id is a number
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const reports = await Report.find({ user: user._id });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getallreports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user', 'username email');
    
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: 'No reports found' });
    }
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getreportbyid = async (req, res) => {
  try {
    const reportId = req.params.report_id;
    const report = await Report.findById(reportId).populate('user', 'username email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deletereport = async (req, res) => {
  try {
    const reportId = req.params.report_id;
    const report = await Report.findByIdAndDelete(reportId);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.updatereportstatus = async (req, res) => {
  try {
    const reportId = req.params.report_id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report status updated successfully', report: updatedReport });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReportImage = async (req, res) => {
  try {
    const reportId = req.params.report_id;
    const report = await Report.findById(reportId);
    if (!report || !report.images) {
      return res.status(404).json({ message: 'Image not found for this report' });
    }

    const fileId = report.images;
    const bucket = getGridFSBucket('uploads'); // Use the correct bucket name

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image file not found' });
    });
    res.set('Content-Type', 'image/jpeg'); // Or detect type if you store it
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error fetching report image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};