const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in days
    description: { type: String },
}, { timestamps: true });

const userSubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);

module.exports = { Subscription, UserSubscription };
