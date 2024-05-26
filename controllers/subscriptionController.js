const { Subscription, UserSubscription } = require('../models/subscriptionModel');
const User = require('../models/userModel');

// Create a new subscription plan
const createSubscriptionPlan = async (req, res) => {
    const { planName, price, duration, description } = req.body;
    try {
        const newPlan = new Subscription({ planName, price, duration, description });
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subscription plan' });
    }
};

// Subscribe a user to a plan
const subscribeUser = async (req, res) => {
    const { subscriptionId } = req.body;
    const userId = req.user.id;
    
    try {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription plan not found' });
        }
        
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + subscription.duration);
        
        const userSubscription = new UserSubscription({
            user: userId,
            subscription: subscriptionId,
            startDate,
            endDate,
        });
        
        const savedUserSubscription = await userSubscription.save();
        res.status(201).json(savedUserSubscription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe user' });
    }
};

// Get user subscription details
const getUserSubscription = async (req, res) => {
    const userId = req.user.id;
    try {
        const userSubscription = await UserSubscription.findOne({ user: userId, isActive: true }).populate('subscription');
        if (!userSubscription) {
            return res.status(404).json({ error: 'No active subscription found for user' });
        }
        res.status(200).json(userSubscription);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user subscription' });
    }
};

module.exports = {
    createSubscriptionPlan,
    subscribeUser,
    getUserSubscription,
};
