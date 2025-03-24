const express = require('express');
const router = express.Router();
const { verifyOtp, refreshOtp } = require('../controllers/otpController');


router.post('/verify-otp', verifyOtp);
router.get('/verify-otp', refreshOtp);

module.exports = router;
