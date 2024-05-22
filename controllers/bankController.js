const User = require('../models/userModel');
const Bank = require('../models/bankModel');
const jwt = require('jsonwebtoken');

// Middleware to validate JWT token
const validateToken = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
  
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
      }
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error('Error in validateToken middleware:', error);
      return res.status(401).json({ error: 'Invalid token or unauthorized' });
    }
  };

// Create or update user's bank details
const updateUserBankDetails = async (req, res) => {
  const { bankName, accountNumber, routingNumber } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware setting req.user

  try {
    let bankDetails = req.user.bankDetails; // Get the user's bank details ID

    if (!bankDetails) {
      // If bank details don't exist, create a new bank document
      const newBank = new Bank({ bankName, accountNumber, routingNumber, user: userId });
      bankDetails = await newBank.save();
      // Update user's bankDetails field with the new bank document ID
      await User.findByIdAndUpdate(userId, { bankDetails });
    } else {
      // If bank details exist, update the existing bank document
      await Bank.findByIdAndUpdate(bankDetails, { bankName, accountNumber, routingNumber });
    }

    res.status(200).json({ message: 'Bank details updated successfully' });
  } catch (error) {
    console.error('Error updating bank details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  validateToken,
  updateUserBankDetails,
  // Other user controller functions
};

