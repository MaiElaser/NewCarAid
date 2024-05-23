const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Vehicle = require("../models/vehicleModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendOTP  = require("../utils/otp");


// Register user


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, mobileNumber, password, confirmPassword, category, otp } = req.body;
  
  if (!username || !email || !mobileNumber || !password || !confirmPassword || !category || !otp) {
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
      category,
      otp, // Store OTP in user document
      otpExpires: Date.now() + 3600000, // OTP expires in 1 hour

    });

   
    // Send OTP after user registration
    await sendOTP(user);

    console.log(`User created ${user}`);
    
    return res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//Vertify
const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    // OTP is valid, clear OTP fields
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return true; // OTP verification successful
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false; // OTP verification failed
  }
};
//Ahmed-OTP
/*
//OTP
if (user) {
  await sendOTP(user); // Send OTP after user registration
  res.status(201).json({ _id: user.id, email: user.email, message: "OTP sent to your email" });
} else {
  res.status(400);
  throw new Error("User data is not valid");
}


// Verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
const { email, otp } = req.body;

if (!email || !otp) {
  res.status(400);
  throw new Error("Please provide email and OTP");
}

const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

if (!user) {
  res.status(400);
  throw new Error("Invalid or expired OTP");
}

// OTP is valid
user.otp = null;
user.otpExpires = null;
await user.save();

res.status(200).json({ message: "OTP verified successfully" });
});

  */

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
  verifyOTP,
};
