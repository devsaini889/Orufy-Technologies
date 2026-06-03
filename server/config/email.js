import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Productr Workspace" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Verification Code - Productr Action Required',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; color: #1f2937;">
        <h2 style="color: #0A1BE2; font-size: 20px; font-weight: bold; margin-bottom: 6px;">Productr Workspace</h2>
        <p style="font-size: 14px; color: #4b5563; margin-bottom: 24px;">Use the following verification code to complete your requested action:</p>
        
        <div style="background-color: #f8f9fb; border: 1px dashed #1131D7; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e254c;">${otp}</span>
        </div>
        
        <p style="font-size: 11px; color: #9ca3af; line-height: 1.5; margin: 0;">
          This verification code is valid for 5 minutes. If you did not request this code, please safely ignore this transaction notification.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};