const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies; 

    if (!cookies?.jwt) {
        return res.sendStatus(401); 
    }

    const refreshToken = cookies.jwt;
    console.log('🔑 Refresh Token:', refreshToken);

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();

        if (!foundUser) {
            return res.sendStatus(403); // User không tồn tại
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.sendStatus(403); // Token không hợp lệ
                }

                if (foundUser.username !== decoded.username) {
                    return res.sendStatus(403);
                }

                const accessToken = jwt.sign(
                    { username: decoded.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error('❌ Lỗi trong handleRefreshToken:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleRefreshToken };
