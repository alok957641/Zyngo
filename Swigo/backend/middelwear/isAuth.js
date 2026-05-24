const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");

const isAuth = async (req, res, next) => {
    // Log incoming cookies to see if the token exists
    console.log("🔍 [Auth Check] Cookies:", req.cookies);

    try {
        // 1. Cookie check
        const token = req.cookies?.token;
        if (!token) {
            console.warn("⚠️ [Auth Warning] Token missing in cookies.");
            return res.status(401).json({ success: false, message: "Token missing! Login required." });
        }

        // 2. Token Verify
        console.log("🔐 [Auth] Verifying token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ [Auth] Token decoded successfully:", decoded);
        
        // 3. ID extraction
        const userId = decoded.id || decoded.userId || decoded._id || decoded.userid;
        console.log("🆔 [Auth] Extracted UserID:", userId);
        
        if (!userId) {
            console.error("❌ [Auth Error] No UserID found in token structure.");
            return res.status(401).json({ success: false, message: "Invalid Token Structure!" });
        }

        // 4. Database User Check
        const user = await User.findById(userId).select("-password");
        if (!user) {
            console.error(`❌ [Auth Error] User not found in database for ID: ${userId}`);
            return res.status(404).json({ success: false, message: "User account not found!" });
        }

        // 5. Attach to req
        req.user = user;
        req.userId = user._id;
        console.log(`👤 [Auth Success] User authenticated: ${user.email || user._id}`);
        
        next();
    } catch (error) {
        // ERROR LOGGING
        console.error("🔥 [Auth Fatal Error]:", error.message);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired! Phir se login karo." });
        }
        return res.status(401).json({ success: false, message: "Authentication failed!" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        console.log("✅ [Admin Check] Admin access granted.");
        next();
    } else {
        console.warn("🚫 [Admin Check] Access denied for user:", req.user?._id);
        return res.status(403).json({ success: false, message: "Access Denied: Admins only!" });
    }
};

module.exports = { isAuth, isAdmin };