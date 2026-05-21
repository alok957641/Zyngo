const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel");

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found! Bhai login toh kar lo." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id || decoded.userid || decoded._id;

        const user = await User.findById(id).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "Bhai user database mein nahi mila!" });
        }

        req.user = user; 
        req.userId = user._id;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Authentication fail ho gayi bhai!' });
    }
};

// 👑 ADMIN CHECK MIDDLEWARE (Ye miss ho raha tha)
const isAdmin = async (req, res, next) => {
    try {
        // isAuth ke baad hi ye chalega, isliye req.user mil jayega
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access Denied! Bhai tum admin nahi ho." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Admin check mein error!" });
    }
};

// 🔥 DONO KO EK SAATH EXPORT KARO
module.exports = { isAuth, isAdmin };