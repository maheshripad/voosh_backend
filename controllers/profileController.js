const User = require('../models/User');

// Get profile details
exports.getProfile = async (req, res, next) => {
    try {
        console.log(`Server is running on port`);
        const userId = req.userId; // Assuming userId is extracted from JWT token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.userId; // Assuming userId is extracted from JWT token
        const updatedFields = req.body;
        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};

// Upload photo
exports.uploadPhoto = async (req, res, next) => {
    try {
        // Implement logic to upload user photo
    } catch (error) {
        next(error);
    }
};

// Set profile visibility
exports.setProfileVisibility = async (req, res, next) => {
    try {
        const userId = req.userId; // Assuming userId is extracted from JWT token
        const { visibility } = req.body;
        const user = await User.findByIdAndUpdate(userId, { profileVisibility: visibility }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile visibility updated successfully', user });
    } catch (error) {
        next(error);
    }
};

// List public profiles
exports.listPublicProfiles = async (req, res, next) => {
    try {
        const publicProfiles = await User.find({ profileVisibility: 'public' });
        res.status(200).json(publicProfiles);
    } catch (error) {
        next(error);
    }
};

// List all profiles (admin only)
exports.listAllProfiles = async (req, res, next) => {
    try {
        // Implement authorization logic to check if user is admin
        // For now, let's assume user is admin
        const allProfiles = await User.find();
        res.status(200).json(allProfiles);
    } catch (error) {
        next(error);
    }
};
