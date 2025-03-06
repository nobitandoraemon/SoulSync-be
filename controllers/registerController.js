const User = require('../models/User');
const bcrypt = require('bcrypt');

const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || username.length < 8) {
        return res.status(400).json({ message: 'Username phải có ít nhất 8 ký tự.' });
    }
    if (!isStrongPassword(password)) {
        return res.status(400).json({ 
            message: 'Password phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.' 
        });
    }

    try {
        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { registerUser };