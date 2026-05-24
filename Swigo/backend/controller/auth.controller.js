const User = require("../models/user/usermodel.js");
const generateToken = require("../utils/tocken.js");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/mail.js");

// ✅ Centralized Cookie Options: Cross-domain ke liye best practice
const cookieOptions = {
    httpOnly: true,
    secure: true,        // Production (Render) par true hona chahiye
    sameSite: "none",    // Cross-site ke liye 'none' zaruri hai
    partitioned: true,   // 🔥 Ye add karo, modern browser iske bina block kar dete hain
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: "/"
};

const sanitizeUser = (user) => ({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    role: user.role
});

// Signup
const signup = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
        if (mobile.length !== 10) return res.status(400).json({ message: "Mobile number must be 10 digits" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ fullname, email, mobile, role, password: hashedPassword });

        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(201).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Signin
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Google Auth
const googleAuth = async (req, res) => {
    try {
        const { fullname, email, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ fullname, email, mobile, role });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Google auth error", error: error.message });
    }
};

// Signout
// Signout
const signout = async (req, res) => {
    try {
        // Options wohi hona chahiye jo login karte waqt use kiye the
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true, // Ye bahut zaroori hai
            path: "/"
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed" });
    }
};
const getMe = async (req, res) => {
    try {
        // middleware ne already req.user set kar diya hoga
        if (!req.user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


// Send OTP
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOtpEmail(email, otp);
        return res.status(200).json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error sending email", error: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "Invalid request or OTP not verified" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};



module.exports = { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth, getMe };