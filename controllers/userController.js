const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, mobileNumber, password, confirmPassword, category } = req.body;
  
  if (!username || !email || !mobileNumber || !password || !confirmPassword || !category ) {
    return res.status(400).json({ error: "Please fill the required fields!" });
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return res.status(400).json({ error: "User is already registered!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }

  try {
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);

    // Create User
    const user = await User.create({
      username,
      email,
      mobileNumber,
      password: hashedPassword,
      category
    });
    
    // Respond with success message
    return res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// Current user
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// Forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists with provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate password reset token
    const token = crypto.randomBytes(20).toString("hex");

    // Update user with reset token and expiry
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Respond with success message
    return res.status(200).json({
      message: "Password reset initiated. Check your email for instructions.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user's password and clear resetToken fields
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Register Vehicle
const registerVehicle = asyncHandler(async (req, res) => {
  const { carType, brand, model, manufacturer, plateNo, color } = req.body;

  if (!carType || !brand || !model || !manufacturer || !plateNo || !color) {
    return res.status(400).json({ error: "Please fill all the required fields!" });
  }

  try {
    // Fetch the user based on the decoded token's user ID
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log("User not found in database.");
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is a Car Owner
    if (user.Category !== 'Car Owner') {
      return res.status(403).json({ error: "Only Car Owners are allowed to register vehicles" });
    }

    // Create a new vehicle with the owner field set to the current user's ID
    const vehicle = await Vehicle.create({
      carType,
      brand,
      model,
      manufacturer,
      plateNo,
      color,
      owner: req.user._id,
    });

    // Update the user's vehicles array with the new vehicle ID
    user.vehicles.push(vehicle._id);
    await user.save();

    return res.status(201).json({
      _id: vehicle._id,
      carType,
      brand,
      model,
      manufacturer,
      plateNo,
      color,
      owner: req.user._id,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return res.status(500).json({ error: "Failed to register vehicle" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword,
  resetPassword,
  registerVehicle,
};
