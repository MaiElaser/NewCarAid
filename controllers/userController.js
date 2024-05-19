/*const asyncHandler = require("express-async-handler");
const dotenv = require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const crypto = require('crypto');

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill the required fields!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User is already registered !");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User Data is not valid");
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
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

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

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists with provided email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate password reset token
        const token = crypto.randomBytes(20).toString('hex');

        // Update user with reset token and expiry (you need to define these fields in your User model)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

        await user.save();

        // Send email with reset link containing token
        // This part is not implemented here, you need to send an email with a link containing the token

        return res.status(200).json({ message: 'Password reset initiated. Check your email for instructions.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = { registerUser, loginUser, currentUser };
*/

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
  const { username, email, mobileNumber, password, confirmPassword , Category } = req.body;
  if (!username || !email || !mobileNumber || !password || !confirmPassword || !Category) {
    res.status(400);
    throw new Error("Please fill the required fields!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is already registered !");
  }
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Password do not match!");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);
  const user = await User.create({
    username,
    email,
    mobileNumber,
    password: hashedPassword,
    Category,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User Data is not valid");
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
// const forgetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user exists with provided email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Generate password reset token
//     const token = crypto.randomBytes(20).toString("hex");

//     // Update user with reset token and expiry (you need to define these fields in your User model)
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

//     await user.save();

//     // Create transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "maielaser22@gmail.com",
//         pass: "dzif eqet ptml qojs",
//       },
//     });

//     let mailOptions = {
//       from: "CarAidEgy@gmail.com",
//       to: user.email, // Change here
//       subject: "Test Email",
//       text: "This is a test mail sent from Nodemailer",
//     };

//     // Send Email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("Error occurred:", error);
//         return res
//           .status(500)
//           .json({ error: "Error occurred while sending email" });
//       } else {
//         console.log("Email sent:", info.response);
//         return res.status(200).json({
//           message:
//             "Password reset initiated. Check your email for instructions.",
//         });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

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

    // Update user with reset token and expiry (you need to define these fields in your User model)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "maielaser22@gmail.com", // Your email address
        pass: "acrc ozrq knsz iqbs ", // Your email password
      },
    });

    const mailOptions = {
      from: "maielaser22@gmail.com", // Your email address
      to: user.email,
      subject: "Password Reset",
      text:
        `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.host}/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
        return res
          .status(500)
          .json({ error: "Error occurred while sending email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message:
            "Password reset initiated. Check your email for instructions.",
        });
      }
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

// registerVehicle 

const registerVehicle = asyncHandler(async (req, res) => {
  const { carType, brand, model, manufacturer, plateNo, color } = req.body;

  if (!carType || !brand || !model || !manufacturer || !plateNo || !color) {
    return res.status(400).json({ error: "Please fill all the required fields!" });
  }

  try {
    console.log("Decoded Token:", req.user); // Log the decoded token
    console.log("Decoded User:", req.user); // Log the decoded user from the token

    // Fetch the user based on the decoded token's user ID
    const user = await User.findById(req.user.id); // Check if req.user.id works for fetching the user

    if (!user) {
      console.log("User not found in database.");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user); // Log the user object retrieved from the database

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

    console.log(`Vehicle created: ${vehicle}`);

    // Update the user's vehicles array with the new vehicle ID
    user.vehicles.push(vehicle._id); // Assuming 'vehicles' is the array field in your User model
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
