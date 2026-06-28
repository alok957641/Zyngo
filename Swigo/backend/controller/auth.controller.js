const User = require("../models/user/usermodel.js");
const generateToken = require("../utils/tocken.js");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/mail.js");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...(isProduction ? { partitioned: true } : {}),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
};

const clearCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...(isProduction ? { partitioned: true } : {}),
    path: "/"
};

const validRoles = ["user", "owner", "deliveryboy"];

const isValidMobile = (mobile) => /^\d{10}$/.test(String(mobile || ""));

const sanitizeUser = (user) => ({
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    profileComplete: Boolean(user.role && isValidMobile(user.mobile))
});

const buildSignedInUser = (user) => ({
    ...sanitizeUser(user),
    profileReviewRequired: false
});

const buildGoogleSignedInUser = (user) => ({
    ...sanitizeUser(user),
    profileReviewRequired: user.role !== "admin"
});

const signup = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!isValidMobile(mobile)) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Please select a valid role" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            fullname,
            email,
            mobile: Number(String(mobile).replace(/\D/g, "")),
            role,
            password: hashedPassword
        });

        const token = generateToken(user._id);
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
        if (!user || !(await bcrypt.compare(password, user.password || ""))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json(sanitizeUser(user));
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { fullname, email, mobile, role } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullname: fullname || email.split("@")[0],
                email,
                mobile: isValidMobile(mobile) ? Number(String(mobile).replace(/\D/g, "")) : 0,
                role: validRoles.includes(role) ? role : "user"
            });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json(buildGoogleSignedInUser(user));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Google auth failed",
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { role, mobile } = req.body;
        const normalizedMobile = String(mobile || "").replace(/\D/g, "");

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Please select a valid role" });
        }

        if (!isValidMobile(normalizedMobile)) {
            return res.status(400).json({ message: "Mobile number must be 10 digits" });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { role, mobile: Number(normalizedMobile) },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            ...sanitizeUser(user),
            profileReviewRequired: false
        });
    } catch (error) {
        return res.status(500).json({ message: "Profile update failed", error: error.message });
    }
};

const signout = async (req, res) => {
    try {
        res.clearCookie("token", clearCookieOptions);
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed" });
    }
};

const getMe = async (req, res) => {
    try {
        if (!req.user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(sanitizeUser(req.user));
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

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

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const newPassword = req.body.newPassword || req.body.newpassword;
        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "Invalid request or OTP not verified" });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

module.exports = {
    signup,
    signin,
    signout,
    sendOtp,
    verifyOtp,
    resetPassword,
    googleAuth,
    getMe,
    updateProfile
};
