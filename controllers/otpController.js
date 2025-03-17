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

// Yêu cầu OTP
const requestOtp = async (req, res) => {
    const { username } = req.body;

    if (!username || !isValidEmail(username)) {
        return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    try {

         // Xóa tất cả OTP cũ của email đó (tránh trùng lặp OTP)
         await Otp.deleteMany({ email: username });

        // Tạo mã OTP và lưu vào MongoDB
        const generatedOtp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        await Otp.create({ username, otp: generatedOtp, expiresAt });

        // Gửi OTP qua email
        await sendOtpByEmail(username, generatedOtp);

        res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi gửi mã OTP.' });
    }
};

// Xác thực OTP
const verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    if (!username || !otp) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mã OTP.' });
    }

    try {
        const storedOtp = await Otp.findOne({ username, otp });

        if (!storedOtp) {
            return res.status(400).json({ message: 'Mã OTP không chính xác.' });
        }

        if (storedOtp.expiresAt < new Date()) {
            await Otp.deleteOne({ username, otp }); // Xóa OTP đã hết hạn
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }
        
        
        // Đánh dấu email là đã xác thực
        await User.updateOne({ username }, { $set: { isVerified: true } });

        await Otp.deleteOne({ username, otp }); // Xóa OTP sau khi xác thực thành công
        res.status(200).json({ message: 'Xác thực OTP thành công.' });

    } catch (error) {
        
        res.status(500).json({ message: 'Lỗi server khi xác thực OTP.' });
    }
};

module.exports = { requestOtp, verifyOtp };
