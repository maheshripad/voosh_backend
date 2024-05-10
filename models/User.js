const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String },
    bio: { type: String },
    phone: { type: String },
    socialId: String, // Store provider-specific ID
    provider: String, // Store provider (e.g., 'google', 'facebook')
    role: { type: String, enum: ['user', 'admin'], default: 'user' } // Include role field
});

module.exports = mongoose.model('User', userSchema);
