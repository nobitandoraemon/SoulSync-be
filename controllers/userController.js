const User = require('../models/User');

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy thông tin một người dùng theo username
const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật thông tin người dùng

const updateUser = async (req, res) => {
    try {
        const { username } = req.params;
        const { birthday, gender, zodiac, hobbies, location, fullName, phoneNumber, quote, image  } = req.body;
        const updateData = { birthday, gender, zodiac, hobbies, location, fullName, phoneNumber, quote, image  };

        const updatedUser = await User.findOneAndUpdate(
            { username },
            updateData,
            { new: true }
        ).select('-password'); // Loại bỏ password khỏi kết quả

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// Xóa người dùng
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ username: req.params.username });
        if (!deletedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getAllUsers, getUserByUsername, updateUser, deleteUser };
