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

