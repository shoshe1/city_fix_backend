const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { user_id, username, password, user_type, user_email } = req.body;

    // Check if user already exists
    const existingUser = await user.findOne({ user_id });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({
      user_id,
      username,
      password: hashedPassword,
      user_type,
      user_email,
      user_photo: req.uploadedFileId || undefined // Store GridFS file ID
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) { 
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user_id = req.params.user_id;
    
        // Find user by user_id
        const existingUser = await
        user.findOne({ user_id });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete user
        await user.deleteOne({ user_id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

