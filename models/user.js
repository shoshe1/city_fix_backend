const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: { type: String, enum: ['citizen', 'admin'], required: true },
  user_email: { type: String, required: true },
  user_photo: { type: mongoose.Schema.Types.ObjectId } 
});

module.exports = mongoose.model('User', userSchema);