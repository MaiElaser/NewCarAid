const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userModel");

const sendOTP = async (user) => {
  const otp = crypto.randomBytes(3).toString("hex"); // Generate a 6-character OTP
  const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.maielaser22@gmail.com,
      pass: process.env.acrc ozrq knsz iqbs,
    },
  });

  const mailOptions = {
    from: process.env.maielaser22@gmail.com,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 1 hour.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
