const jwt = require ('jsonwebtoken');

const verifyAccessToken = (req,res,next) => {
    const cookies = req.cookies;
    
    if(!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const authHeader = req.headers ['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Không có accessToken

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
        if (err) return res.sendStatus(403); // Token không hợp lệ hoặc hết hạn
        req.user = decoded.username;
        next();
    });
};

module.exports = verifyAccessToken;
