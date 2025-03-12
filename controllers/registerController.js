const User = require('../models/User');
const bcrypt = require('bcrypt');
const Otp = require('../models/Otp');

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

const registerUser = async (req, res) => {
    const { username, password, otp } = req.body;

    if (!username || !isValidEmail(username)) {
        return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Email đã tồn tại.' });
        }

        const storedOtp = await Otp.findOne({ username, otp });
        if (!storedOtp || storedOtp.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Mã OTP không chính xác hoặc đã hết hạn.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        await Otp.deleteOne({ username, otp });

        res.status(201).json({ message: 'Đăng ký thành công.' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = { registerUser };
