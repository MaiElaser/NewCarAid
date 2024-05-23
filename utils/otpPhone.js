const twilio = require("twilio");

const accountSid = 'your_account_sid'; // Your Twilio account SID
const authToken = 'your_auth_token'; // Your Twilio auth token
const twilioPhoneNumber = 'your_twilio_phone_number'; // Your Twilio phone number

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
