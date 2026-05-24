const express = require("express");
const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth } = require("../controller/auth.controller");
const jwt = require("jsonwebtoken"); // ✅ Add this
const User = require("../models/user/usermodel.js"); // ✅ Add this

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/varifyOtp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);

// ✅ NEW ROUTE: Get current user (for frontend persistence)
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user without password
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sanitize user data (same as signup/signin)
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
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;