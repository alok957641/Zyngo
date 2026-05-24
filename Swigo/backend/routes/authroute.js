const express = require("express");
const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth } = require("../controller/auth.controller");
const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);  // ✅ Fixed spelling
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);

// ✅ Get current user (for frontend persistence)
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Fix: decoded mein userId kaunsa field hai check kar
        const userId = decoded.userId || decoded.id || decoded._id;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const sanitizeUser = (user) => {
            return {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            };
        };

        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        console.error("Auth me error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;