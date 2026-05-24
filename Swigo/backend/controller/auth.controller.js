const User = require("../models/user/usermodel.js");
const generateToken = require("../utils/tocken.js");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/mail.js");

// ✅ Add this helper function
const sanitizeUser = (user) => {
    return {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        role: user.role
    };
};
// ✅ Correct cookie options for Cross-Site (Vercel <-> Render)
const cookieOptions = {
    httpOnly: true,
    secure: true,         // Render par HTTPS hota hai, so true zaruri hai
    sameSite: "none",     // Cross-site ke liye 'none' hi chahiye
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};

const signup = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ fullname, email, mobile, role, password: hashedPassword });

        const token = generateToken(user._id);

        // ✅ Use cookieOptions here
        res.cookie("token", token, cookieOptions);

        return res.status(201).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        console.log("Cookie set kar raha hoon:", token);
        res.cookie("token", token, cookieOptions);
        // ✅ Use cookieOptions here
        res.cookie("token", token, cookieOptions);

        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
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



// Signout
const signout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed", error: error.message });
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

// Google Auth
const googleAuth = async (req, res) => {
    try {
        const { fullname, email, mobile, role } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ fullname, email, mobile, role });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Google auth error", error: error.message });
    }
};

module.exports = { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth, getMe };