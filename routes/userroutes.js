const express = require('express');
const router = express.Router();

// Import controller functions
const userController = require('../controllers/usercontroller');
const {upload , uploadImageToGridFS} = require('../middleware/uploadMiddleware');

// Public routes
router.post('/register', upload.single('user_photo'), uploadImageToGridFS, userController.createUser);
router.post('/login', userController.authenticateUser);

// User routes
router.get('/profile/:user_id', userController.getUserProfile);router.delete('/:user_id', userController.deleteUser);
router.get('/:user_id/image', userController.getUserImage);
router.get('/:user_id/reports', userController.getUserReports);
// router.get('/reports/:user_id', userController.getuserreportshistory);

// Admin routes
router.get('/', userController.getAllUsers);



module.exports = router;