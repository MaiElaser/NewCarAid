
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

const getWalletBalance = async (req, res) => {
    const userId = req.user.id;
    console.log (userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role.toLowerCase().replace(/\s+/g, '') === 'shopowner') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId:userId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the wallet balance' });
    }
};

const addFunds = async (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;
  
    if (req.user.role.toLowerCase().replace(/\s+/g, '') === 'shopowner') {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.role === 'Shop Owner') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      wallet.balance += amount;
      await wallet.save();
      return res.json({ balance: wallet.balance });
    } catch (error) {
      console.error('Error adding funds:', error);
      return res.status(500).json({ error: 'An error occurred while adding funds to the wallet' });
    }
  };
  

const withdrawFunds = async (req, res) => {
    const  userId  = req.user.id;
    const { amount } = req.body;

    if (req.user.role.toLowerCase().replace(/\s+/g, '') === 'sparepartsshop') {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role === 'Shop Owner') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        wallet.balance -= amount;
        await wallet.save();
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        res.status(500).json({ error: 'An error occurred while withdrawing funds from the wallet' });
    }
};

const createWalletForUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingWallet = await Wallet.findOne({ userId });
        if (existingWallet) {
            return res.status(200).json({ message: 'Wallet already exists', wallet: existingWallet });
        }

        const wallet = new Wallet({
            userId,
            balance: 0
        });

        await wallet.save();
        res.status(201).json({ message: 'Wallet created successfully', wallet });
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'An error occurred while creating the wallet' });
    }
};

const deleteWalletForUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        await wallet.deleteOne({ userId });
        res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ error: 'An error occurred while deleting the wallet' });
    }
};

module.exports = { getWalletBalance, addFunds, withdrawFunds, createWalletForUser, deleteWalletForUser };

//ChatGPT
/*
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const getWalletBalance = async (req, res) => {
    const { userId } = req.params;

    try {
        const objectId = mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId: objectId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        let errorMessage = 'An error occurred while retrieving the wallet balance';
        if (error instanceof mongoose.Error.CastError) {
            errorMessage = 'Invalid user ID format';
        }
        res.status(500).json({ error: errorMessage });
    }
};

const addFunds = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const objectId = mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId: objectId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        wallet.balance += amount;
        await wallet.save();
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error adding funds:', error);
        let errorMessage = 'An error occurred while adding funds to the wallet';
        if (error instanceof mongoose.Error.CastError) {
            errorMessage = 'Invalid user ID format';
        }
        res.status(500).json({ error: errorMessage });
    }
};

const withdrawFunds = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const objectId = mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId: objectId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        wallet.balance -= amount;
        await wallet.save();
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        let errorMessage = 'An error occurred while withdrawing funds from the wallet';
        if (error instanceof mongoose.Error.CastError) {
            errorMessage = 'Invalid user ID format';
        }
        res.status(500).json({ error: errorMessage });
    }
};

module.exports = { getWalletBalance, addFunds, withdrawFunds };
*/
