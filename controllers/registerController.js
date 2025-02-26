const User = require('../models/User');
const bcrypt = require('bcrypt');

// Đăng ký
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
        return res.status(400).json({ message: 'Username và mật khẩu là bắt buộc.' });
    }

    try {
        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới chỉ với username và password đã mã hóa
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { registerUser };
