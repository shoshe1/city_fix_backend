const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  issueType: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: { type: String, default: 'pending' },
  images: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
 user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // <-- Capital "U"
  user_id: { type: String },   // custom user_id
  user_name: { type: String }  // username
});

module.exports = mongoose.model('Report', reportSchema);
