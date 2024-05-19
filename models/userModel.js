const { string, required } = require("joi");
const mongoose = require("mongoose");

const categoryOptions = ['Mechanic', 'Car Owner', 'Shop Owner'];

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter the username"],
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: true,
    },
    mobileNumber: {
        type : String,
        required: [true, "Please Enter your mobile number"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        unique: true,
    },
    Category: {
    type: String,
    required: [true, "Category yourself / Type of service"],
    enum: categoryOptions
    },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    bankDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' },
    
    
    resetPasswordToken : String,
    resetPasswordExpires : Date
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);

