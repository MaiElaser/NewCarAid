// controllers/profileController.js
const User = require('../models/User'); // Assuming you have a User model

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'An error occurred while fetching the profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'An error occurred while updating the profile' });
    }
};
