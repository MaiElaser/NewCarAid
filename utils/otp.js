/*const nodemailer = require("nodemailer");

const sendOTP = async (user) => {
  const otp = generateOTP(); // Generate OTP (you can use your own logic here)
  const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

  // Update user document with OTP and expiry
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Your email address
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 1 hour.`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending OTP via Email:", error);
    throw new Error("Error sending OTP via Email");
  }
};

const generateOTP = () => {
  // Generate OTP logic (e.g., using random numbers or crypto library)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendOTP };
*/
//new
const twilio = require("twilio");

// Optionally load environment variables
require('dotenv').config(); // Make sure you have the dotenv package installed

const accountSid = process.env.ACa58d8a67e28c1d5f5f6d8447af249129 || 'ACa58d8a67e28c1d5f5f6d8447af249129'; // Your Twilio account SID
const authToken = process.env.dfc86449f2a069eb653c689f67c39c79 || 'dfc86449f2a069eb653c689f67c39c79'; // Your Twilio auth token
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || 'your_twilio_phone_number'; // Your Twilio phone number

// Validate accountSid format
if (!accountSid.startsWith('AC')) {
  throw new Error('Invalid accountSid. It must start with "AC".');
}

const client = new twilio(accountSid, authToken);

const sendOTP = async (user) => {
  const otp = generateOTP(); // Generate OTP (you can use your own logic here)
  const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

  // Update user document with OTP and expiry
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}. It will expire in 1 hour.`,
      from: twilioPhoneNumber,
      to: user.mobileNumber
    });

    console.log(`OTP sent to ${user.mobileNumber}`);
  } catch (error) {
    console.error("Error sending OTP via SMS:", error);
    throw new Error("Error sending OTP via SMS");
  }
};

const generateOTP = () => {
  // Generate OTP logic (e.g., using random numbers or crypto library)
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendOTP };


