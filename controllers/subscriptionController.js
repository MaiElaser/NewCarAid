const { Subscription, UserSubscription } = require('../models/subscriptionModel');
const User = require('../models/userModel');
const Wallet = require('../models/walletModel');


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
    const { planId } = req.body;
    const userId = req.user.id;

    try {
        const subscription = await Subscription.findById(planId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription plan not found' });
        }

        const existingSubscription = await UserSubscription.findOne({ user: userId });
        if (existingSubscription) {
            return res.status(400).json({ error: 'User cannot subscribe to more than one plan' });
        }

/*         const wallet = await Wallet.findOne({ user: userId });
        console.log(wallet)
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        if (wallet.balance < subscription.price) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        wallet.balance -= subscription.price;
        await wallet.save(); */

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + subscription.duration);

        const userSubscription = new UserSubscription({
            user: userId,
            subscription: planId,
            startDate,
            endDate,
        });

        const savedUserSubscription = await userSubscription.save();
        console.log('Saved User Subscription:', savedUserSubscription);
        res.status(201).json(savedUserSubscription);
    } catch (error) {
        console.error('Error subscribing user:', error);
        res.status(500).json({ error: 'Failed to subscribe user' });
    }
};
  
  

// Get user subscription details
const getUserSubscription = async (req, res) => {
  const userId = req.user.id;
  try {
    console.log(`Fetching subscription for user: ${userId}`);
    const userSubscription = await UserSubscription.findOne({ user: userId, isActive: true }).populate('subscription');
    
    if (!userSubscription) {
      return res.status(404).json({ error: 'No active subscription found for user' });
    }

    if (!userSubscription.subscription) {
      console.error(`Subscription details not found for UserSubscription with id ${userSubscription._id}`);
      return res.status(500).json({ error: 'Subscription details could not be retrieved' });
    }

    console.log(`Retrieved subscription details for UserSubscription with id ${userSubscription._id}:`, userSubscription.subscription);
    

    res.status(200).json(userSubscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user subscription' });
  }
}; 





const unSubscribe = async (req,res)=>{
    const userId = req.user.id;

    try{
        const userSubscription = await UserSubscription.findOne({ user: userId, isActive: true }).populate('subscription');
    
        if (!userSubscription) {
          return res.status(404).json({ error: 'No active subscription found for user' });
        }
        await UserSubscription.findByIdAndDelete(userSubscription._id)
        res.status(200).json({ message: 'You unsubscribed successfully' });

    }catch(error){
        res.status(500).json({ error: 'Failed to retrieve user subscriptions' });
    }
    
};






const getAllUserSubscription = async (req, res) => {
    try {
        const userSubscriptions = await UserSubscription.find().populate('subscription');
        res.status(200).json(userSubscriptions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user subscriptions' });
    }
};


  


const getAllSubscriptionPlan = async (req, res) => {
    try {
      const plans = await Subscription.find();
      return res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all available plans' });
    }
  };

  const deleteSubscriptionPlan = async (req, res) => {
    try {
      const planId = req.params.id;
      
      const plan = await Subscription.findById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      await Subscription.findByIdAndDelete(planId);
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the plan' });
    }
  };

  const deleteUserSubscriptions = async (req, res) => {
    const userId = req.user.id;

    try {
        console.log(userId)
        const result = await UserSubscription.deleteMany({ user: userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No subscriptions found for this user' });
        }

        res.status(200).json({ message: `Deleted ${result.deletedCount} subscriptions for user ${userId}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user subscriptions' });
    }
};


  
  const updateSubscriptionPlan = async (req, res) => {
    const { planName, price, duration, description } = req.body;
    const planId = req.params.id;
    try {
        const updatedPlan = await Subscription.findByIdAndUpdate(planId, 
            { planName, price, duration, description },
            { new: true }
        );
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subscription plan' });
    }
};
  
  

module.exports = {
    createSubscriptionPlan,
    subscribeUser,
    getUserSubscription,
    getAllSubscriptionPlan,
    deleteSubscriptionPlan,
    updateSubscriptionPlan,
    getAllUserSubscription,
    deleteUserSubscriptions,
    unSubscribe,

};
