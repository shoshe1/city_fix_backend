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

// Authenticate user

exports.authenticateUser = async (req, res) => {
  try {
    const { user_email, password, user_type } = req.body;

    // Find user by user_email
    const existingUser = await user.findOne({ user_email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if user type matches (if provided in request)
    if (user_type && existingUser.user_type !== user_type) {
      return res.status(403).json({ 
        message: `Authentication failed. You are registered as a ${existingUser.user_type}, please use the correct login option.` 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: existingUser.user_id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    // Return user details along with token
    res.status(200).json({ 
      message: 'Authentication successful', 
      token,
      user: {
        user_id: existingUser.user_id,
        username: existingUser.username,
        user_email: existingUser.user_email,
        user_type: existingUser.user_type
      }
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 
// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user_id = req.params.user_id;
    
        // Find user by user_id
        const existingUser = await user.findOne({ user_id });
        if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json({ user: existingUser });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    }
// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const { username, user_email } = req.body;
    
        // Find user by user_id
        const existingUser = await user.findOne({ user_id });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Update user fields
        existingUser.username = username || existingUser.username;
        existingUser.user_email = user_email || existingUser.user_email;
        existingUser.user_photo = req.uploadedFileId || existingUser.user_photo; // Update photo if provided
        if (req.file) {
            existingUser.user_photo = req.uploadedFileId;
        }

    
        await existingUser.save();
    
        res.status(200).json({ message: 'User profile updated successfully', user: existingUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
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

