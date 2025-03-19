const jwt = require ('jsonwebtoken');

const verifyAccessToken = (req,res,next) => {
    // const cookies = req.cookies;
    
    // if(!cookies?.jwt) {
    //     console.log("Cookie lỗi");
    //     return res.sendStatus(401).json("Cookie lỗi");
    // }

    const authHeader = req.headers ['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Không có accessToken

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
        if (err) {
            console.log("Header token lỗi");
            return res.sendStatus(403).json("Header token lỗi"); // Token không hợp lệ hoặc hết hạn
        }
        req.user = decoded.username;
        next();
    });
};

module.exports = verifyAccessToken;
