const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");

const debugLog = (...args) => {
    if (process.env.NODE_ENV === "development") console.log(...args);
};

const debugWarn = (...args) => {
    if (process.env.NODE_ENV === "development") console.warn(...args);
};

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            debugWarn("[Auth Warning] Token missing in cookies.");
            return res.status(401).json({ success: false, message: "Token missing! Login required." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.userid;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token Structure!" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found!" });
        }

        req.user = user;
        req.userId = user._id;
        debugLog(`[Auth Success] User authenticated: ${user.email || user._id}`);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired! Please login again." });
        }
        return res.status(401).json({ success: false, message: "Authentication failed!" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        debugLog("[Admin Check] Admin access granted.");
        next();
    } else {
        debugWarn("[Admin Check] Access denied for user:", req.user?._id);
        return res.status(403).json({ success: false, message: "Access Denied: Admins only!" });
    }
};

module.exports = { isAuth, isAdmin };
