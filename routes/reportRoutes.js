const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
require('../models/user'); // <-- Add this line to register the user schema
// In routes/reportRoutes.js
const { upload, uploadImageToGridFSForReport } = require('../middleware/uploadMiddleware');
router.post('/create', upload.single('image'), uploadImageToGridFSForReport, reportController.createReport);
// router.get('/reports', reportController.getReports);
// router.delete('/reports/:report_id', reportController.deleteReport);
// router.get('/reports/:report_id', reportController.getReportById);
// router.put('/reports/:report_id', reportController.updateReport);
// router.get('/reports/status/:status', reportController.getReportsByStatus);
// router.get('/reports/category/:category', reportController.getReportsByCategory);
// router.get('/reports/recent', reportController.getRecentReports);
// router.get('/reports/search', reportController.searchReports);
// router.get('/reports/user/:user_id', reportController.getReportsByUser);
router.get('/user/:user_id', reportController.getReportsbyuserid);
router.get('/getAllreports', reportController.getallreports);
//get report by id
router.get('/:report_id', reportController.getreportbyid);
//delete report by id
router.delete('/:report_id', reportController.deletereport);
//update status
router.put('/:report_id/status', reportController.updatereportstatus);
router.get('/:report_id/image', reportController.getReportImage);
module.exports = router;
