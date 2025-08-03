const Notification = require('../models/notification');

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, report, message } = req.body;
    const notification = new Notification({ recipient, report, message });
    await notification.save();
    res.status(201).json({ message: 'Notification sent', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


