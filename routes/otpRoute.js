const express = require('express');
const router = express.Router();
const { verifyOtp, refreshOtp } = require('../controllers/otpController');


router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshOtp);

module.exports = router;
