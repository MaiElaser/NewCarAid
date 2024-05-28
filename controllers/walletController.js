
const Wallet = require('../models/walletModel');
const User = require('../models/userModel');

const getWalletBalance = async (req, res) => {
    const { userId } = req.params;
    console.log (userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId });
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
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        wallet.balance += amount;
        await wallet.save();
        res.json({ balance: wallet.balance });
    } catch (error) {
        console.error('Error adding funds:', error);
        res.status(500).json({ error: 'An error occurred while adding funds to the wallet' });
    }
};

const withdrawFunds = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'car_owner' && user.role !== 'mechanic') {
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

module.exports = { getWalletBalance, addFunds, withdrawFunds };

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
