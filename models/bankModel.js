const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    bankName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },
    // Link bank details to a user
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Bank', bankSchema);
