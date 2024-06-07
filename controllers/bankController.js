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

  const getBankDetails = async (req, res) => {
    const userId = req.user.id;
    try {
      let bankDetails = await Bank.find({ user: userId });

      if (!bankDetails || bankDetails.length === 0) {
        return res.status(404).json({ message: " No bank details  for this user!!" });
      }

      res.status(200).json(bankDetails);
    } catch (error) {
      res.status(500).json({ error: 'Error getting bank details' });
    }
  }
  

  const getBankDetailsByCardNumber = async (req, res) => {
    const {cardNumber} = req.params.id; 
    try {
      const bankDetails = await Bank.findOne({ cardNumber : cardNumber });
    
      if (!bankDetails) {
        return res.status(404).json({ message: "Bank details not found for this account number" });
      }
      
      res.status(200).json(bankDetails);
    } catch (error) {
      res.status(500).json({ error: 'Error getting bank details' });
    }
  }

// controllers/bankController.js
const addUserBankDetails = async (req, res) => {
  const { cardNumber, expiryMonth, expiryYear, securityCode, firstName, lastName, removable } = req.body;
  const userId = req.user.id;
  try {
    if (!cardNumber || !expiryMonth || !expiryYear || !securityCode || !firstName || !lastName) {
      return res.status(422).json({ message: "Please enter all the missing fields" });
    }

    const existingBankDetail = await Bank.findOne({ user: userId, cardNumber });
    if (existingBankDetail) {
      return res.status(400).json({ message: "Account number is already added for this user" });
    }

    const newBank = new Bank({ cardNumber, expiryMonth, expiryYear, securityCode, firstName, lastName, removable, user: userId });
    const savedBankDetails = await newBank.save();
    return res.status(200).json({ message: 'Bank details added successfully', bankDetails: savedBankDetails });

  } catch (error) {
    console.error('Error while adding user bank details:', error);
    res.status(500).json({ message: "Error while adding user bank details", error });
  }
};

module.exports = { addUserBankDetails };

  
  const updateUserBankDetails = async (req, res) => {
    const { cardNumber, expiryMonth, expiryYear, securityCode, firstName, lastName, removable } = req.body;
    const userId = req.user.id;
    const { bankDetailsId } = req.params; // Correct extraction of bankDetailsId

    try {
        const bankDetails = await Bank.findOne({ _id: bankDetailsId, user: userId });
        console.log("bankdetails", bankDetails);
        if (!bankDetails) {
            return res.status(404).json({ message: "Bank details not found for this user" });
        }

/*         if (!cardNumber || !expiryMonth || !expiryYear || !securityCode || !firstName || !lastName) {
            return res.status(422).json({ message: "Please enter all the missing fields" });
        } */
        
        const updatedBankDetails = await Bank.findByIdAndUpdate(bankDetailsId, { cardNumber, expiryMonth, expiryYear, securityCode, firstName, lastName, removable }, { new: true });
        res.status(200).json({ message: 'Bank details updated successfully', bankDetails: updatedBankDetails });

    } catch (error) {
        res.status(500).json({ message: "Error while updating user bank details", error });
    }
};



  const deleteUserBankDetails = async (req, res) => {
    const userId = req.user.id;
    const bankDetailsId = req.params.id; 
  
    try {
      const bankDetails = await Bank.findOne({ _id: bankDetailsId, user: userId });
  
      if (!bankDetails) {
        return res.status(404).json({ message: "Bank details not found for this user" });
      }
  
      await Bank.findByIdAndDelete(bankDetailsId);
      res.status(200).json({ message: 'Bank details deleted successfully' });
  
    } catch (error) {
      res.status(500).json({ message: "Error while deleting user bank details", error });
    }
  };
  
  
  

// Create or update user's bank details
/* const updateUserBankDetails = async (req, res) => {
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
}; */

module.exports = {
  validateToken,
  updateUserBankDetails,
  getBankDetails,
  getBankDetailsByCardNumber,
  addUserBankDetails,
  deleteUserBankDetails,
  // Other user controller functions
};

