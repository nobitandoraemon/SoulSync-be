const nodemailer = require('nodemailer');
const User = require('../models/User');
const { opts } = require('../utils/tempStorage');

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});



// Tạo mã OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpByEmail = async (username) => {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // Hết hạn sau 2 phút

    opts.set(username, { otp, expiresAt });

    await transporter.sendMail({
        from: process.env.EMAIL_ADMIN,
        to: username,
        subject: 'Mã OTP của bạn',
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 2 phút.`
    });
};


const verifyOtp = async (req, res) => {
    const { username, otp } = req.body;

    const storedOtp = opts.get(username);
    if (!storedOtp) {
        return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }

    // Kiểm tra thời hạn trước khi so sánh OTP
    if (new Date() > storedOtp.expiresAt) {
        opts.delete(username);
        return res.status(400).json({ message: 'OTP đã hết hạn.' });
    }

    if (storedOtp.otp.toString() !== otp) {
        return res.status(400).json({ message: 'OTP không chính xác.' });
    }

    const user = await User.findOne({ username });
    // const tempUser = userTempStorage.get(username);
    // console.log('tempUser:', tempUser);

    if (!user) {
        return res.status(400).json({ message: 'Thông tin người dùng không tồn tại hoặc đã hết hạn.' });
    }

    user.isVerified = true;
    await user.save();

    opts.delete(username);

    res.status(200).json({ message: 'Xác nhận gmail thành công.' });
};

const refreshOtp = async (req, res) => {
    const { username } = req.body;
    await sendOtpByEmail(username);
    res.status(200).json({ message: 'Check mail để lấy mã OTP!' });
}

module.exports = { sendOtpByEmail, verifyOtp, refreshOtp };
