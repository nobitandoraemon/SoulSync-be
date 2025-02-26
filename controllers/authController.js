const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// LOGIN
const loginUser = async (req, res) => {
    const { username, password } = req.body; 
    if (!username || !password) {
        return res.status(400).json({ message: "Tên và mật khẩu là bắt buộc." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ.' });
        }

        const accessToken = jwt.sign(
            { username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        user.refreshToken = refreshToken;

        try {
            await user.save();
        } catch (err) {
            return res.status(500).json({ message: 'Không thể lưu refresh token.' });
        }

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// LOGOUT 
const logoutUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
            return res.sendStatus(204);
        }

        user.refreshToken = '';
        try {
            await user.save();
        } catch (err) {
            return res.status(500).json({ message: 'Không thể xóa refresh token.' });
        }

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Đăng xuất thành công' });

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

module.exports = { loginUser, logoutUser };
