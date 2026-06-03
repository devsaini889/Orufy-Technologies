import OtpVerification from '../models/otp.model.js';
import { sendOtpEmail } from '../config/email.js';

export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear older OTP configurations for this email address instance
    await OtpVerification.deleteMany({ email });

    await OtpVerification.create({ email, otp: generatedOtp });

    await sendOtpEmail(email, generatedOtp);

    res.status(200).json({ success: true, message: 'OTP sent successfully to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to dispatch OTP: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP fields are required' });
    }

    const otpRecord = await OtpVerification.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or code entry has expired' });
    }

    await OtpVerification.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ success: true, message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};