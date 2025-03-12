const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Lỗi kết nối SMTP:', error);
    } else {
        console.log('Kết nối SMTP thành công!');
    }
});

// Tạo mã OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gửi OTP qua email
const sendOtpByEmail = async (email, otp) => {
    console.log(`Gửi mã OTP ${otp} đến email ${email}`);  // Log email và mã OTP
    const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: 'Xác thực OTP',
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Mã OTP đã được gửi đến email ${email}`);
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);  // Log chi tiết lỗi khi gửi email
        throw error;
    }
};

// Yêu cầu OTP
const requestOtp = async (req, res) => {
    const { username } = req.body;
    console.log(`Yêu cầu OTP cho email: ${username}`);  // Log email yêu cầu OTP

    if (!username) {
        return res.status(400).json({ message: 'Vui lòng nhập email.' });
    }

    try {
        // Tạo mã OTP và lưu vào MongoDB
        const generatedOtp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

        console.log(`Tạo mã OTP: ${generatedOtp} cho email: ${username}`);

        await Otp.create({ username, otp: generatedOtp, expiresAt });

        // Gửi OTP qua email
        await sendOtpByEmail(username, generatedOtp);

        res.status(200).json({ message: 'Mã OTP đã được gửi đến email của bạn.' });

    } catch (error) {
        console.error('Lỗi server khi gửi mã OTP:', error);  // Log lỗi server
        res.status(500).json({ message: 'Lỗi server khi gửi mã OTP.' });
    }
};

// Xác thực OTP
const verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
    console.log(`Xác thực OTP cho email: ${username}, mã OTP: ${otp}`);  // Log email và OTP xác thực

    if (!username || !otp) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mã OTP.' });
    }

    try {
        const storedOtp = await Otp.findOne({ username, otp });

        if (!storedOtp) {
            console.log(`Mã OTP không chính xác cho email: ${username}`);
            return res.status(400).json({ message: 'Mã OTP không chính xác.' });
        }

        if (storedOtp.expiresAt < new Date()) {
            await Otp.deleteOne({ username, otp }); // Xóa OTP đã hết hạn
            console.log(`Mã OTP đã hết hạn cho email: ${username}`);
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }

        await Otp.deleteOne({ username, otp }); // Xóa OTP sau khi xác thực thành công
        console.log(`Xác thực OTP thành công cho email: ${username}`);
        res.status(200).json({ message: 'Xác thực OTP thành công.' });

    } catch (error) {
        console.error('Lỗi server khi xác thực OTP:', error);  // Log lỗi server
        res.status(500).json({ message: 'Lỗi server khi xác thực OTP.' });
    }
};

module.exports = { requestOtp, verifyOtp };
