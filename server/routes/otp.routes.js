import express from 'express';
import { requestOtp, verifyOtp } from '../controllers/otp.controller.js';

const router = express.Router();

router.post('/send-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

export default router;