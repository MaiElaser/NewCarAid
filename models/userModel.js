const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const categoryOptions = ["Mechanic", "Car Owner", "Shop Owner"];
const roleOptions = require("../config/roles.json"); // Add roles as needed
const { array } = require("joi");

const userSchema = new mongoose.Schema(
  {
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
      type: String,
      required: [true, "Please Enter your mobile number"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    /* category: {
      type: String,
      required: [true, "Category yourself / Type of service"],
      enum: categoryOptions,
    },
    */
    role: {
      type: String,
      array: roleOptions,
      required: true, // Make sure every user has a role
    },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    bankDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    // subscription: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "UserSubscription",
    // },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
