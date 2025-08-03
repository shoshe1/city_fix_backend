const express = require('express');
const router = express.Router();
const notificationcontroller = require('../controllers/notificationcontroller');
require('../models/user');

router.post('/create', notificationcontroller.createNotification);
router.get('/user/:user_id', notificationcontroller.getUserNotifications);

module.exports = router;
