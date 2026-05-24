const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");

const isAuth = async (req, res, next) => {
    try {
        // 1. Cookie check
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Token missing! Login required." });
        }

        // 2. Token Verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. ID extraction (Logs check karne ke liye)
        const userId = decoded.id || decoded.userId || decoded._id || decoded.userid;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Invalid Token Structure!" });
        }

        // 4. Database User Check
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found!" });
        }

        // 5. Attach to req
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        // ERROR LOGGING: Render logs mein yahan se pata chalega ki expired hai ya signature mismatch
        console.error("JWT Verification Error:", error.message);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired! Phir se login karo." });
        }
        return res.status(401).json({ success: false, message: "Authentication failed!" });
    }
};

const isAdmin = (req, res, next) => {
    // req.user check karna zaroori hai kyunki isAuth pehle call hona chahiye
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Access Denied: Admins only!" });
    }
};

module.exports = { isAuth, isAdmin };