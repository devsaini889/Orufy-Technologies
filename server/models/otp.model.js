import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Document self-deletes from MongoDB automatically after 5 minutes
    },
  },
  { versionKey: false }
);

const OtpVerification = mongoose.model('OtpVerification', otpSchema);
export default OtpVerification;