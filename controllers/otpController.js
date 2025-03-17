const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const User = require('../models/User');

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

// Gửi OTP qua email
const sendOtpByEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: 'Xác thực OTP',
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

const requestOtp = async (req, res) => {
    const { username } = req.body;

    try {
        await Otp.deleteMany({ username });

        const generatedOtp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.create({ username, otp: generatedOtp, expiresAt, newUser: req.newUser });

        await sendOtpByEmail(username, generatedOtp);

        res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi gửi mã OTP.' });
    }
};

const verifyOtp = async (req, res) => {
    const { username, otp } = req.body;

    try {
        const storedOtp = await Otp.findOne({ username, otp });

        if (!storedOtp || storedOtp.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Mã OTP không chính xác hoặc đã hết hạn.' });
        }

        const newUser = storedOtp.newUser;
        await newUser.save();
        await Otp.deleteOne({ username, otp });

        res.status(201).json({ message: 'Đăng ký thành công.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xác thực OTP.' });
    }
};


module.exports = { requestOtp, verifyOtp };
