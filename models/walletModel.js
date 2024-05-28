const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
});


module.exports = mongoose.model("Wallet", walletSchema);
