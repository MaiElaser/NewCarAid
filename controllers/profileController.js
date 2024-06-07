const User = require('../models/userModel'); // Assuming you have a User model
const bcrypt = require('bcrypt');



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

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'An error occurred while deleting the profile' });
    }
};


exports.getAllUsersCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user count' });
    }
};

exports.getRandomProfiles = async (req, res) => {
    try {
        const randomProfiles = await User.aggregate([{ $sample: { size: 8 } }]);
        res.json(randomProfiles);
    } catch (error) {
        console.error('Error fetching random profiles:', error);
        res.status(500).json({ error: 'An error occurred while fetching random profiles' });
    }
};



exports.getRandomMechanicProfiles = async (req, res) => {
    try {
      const mechanics = await User.find({ role: 'Mechanic' });
  
      if (mechanics.length < 5) {
        return res.status(400).json({ message: 'Not enough mechanics in the database' });
      }
  
      const shuffledMechanics = mechanics.sort(() => 0.5 - Math.random()).slice(0, 5);
  
      res.json(shuffledMechanics);
    } catch (error) {
      console.error('Error fetching random mechanic profiles:', error);
      res.status(500).json({ message: 'Error fetching random mechanic profiles', error });
    }
  };


exports.getRandomSparePartsShops = async (req, res) => {
    try {
      const randomSparePartsShops = await User.aggregate([
        { $match: { role: "Spare parts shop" } },
        { $sample: { size: 8 } }
      ]);
      res.json(randomSparePartsShops);
    } catch (error) {
      console.error("Error fetching random spare parts shops:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  

exports.getMechanicProfile = async (req, res) => {
    try {
      const mechanicId = req.params.id;
  
      if (!mechanicId) {
        return res.status(400).json({ message: 'Mechanic ID is required' });
      }
  
      const mechanic = await User.findById(mechanicId);
      if (!mechanic) {
        return res.status(404).json({ message: 'Mechanic not found' });
      }
      res.json(mechanic);
    } catch (error) {
      console.error('Error fetching mechanic profile:', error);
      res.status(500).json({ message: 'Error fetching mechanic profile', error });
    }
};
  


exports.changePassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
  
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Please provide email, new password, and confirm password" });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match" });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
};