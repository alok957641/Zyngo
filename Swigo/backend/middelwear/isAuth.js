const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel");

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found! Login toh kar lo bhai." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Yahan decoded mein se sahi ID nikaal rahe hain
        const userId = decoded.id || decoded.userId || decoded._id;

        const user = await User.findById(userId).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "User database mein nahi mila!" });
        }

        req.user = user; 
        req.userId = user._id;
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: 'Authentication fail ho gayi bhai!' });
    }
};

// 👑 ADMIN CHECK
const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied! Sirf Admin allowed hai." });
    }
};

// 🛵 DELIVERY BOY CHECK (Isse use karo deliveryboy wale routes par)
const isDeliveryBoy = async (req, res, next) => {
    if (req.user && req.user.role === "deliveryboy") {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied! Sirf Delivery Boy allowed hai." });
    }
};

module.exports = { isAuth, isAdmin, isDeliveryBoy };