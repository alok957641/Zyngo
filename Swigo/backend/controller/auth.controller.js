const User = require("../models/user/usermodel.js");
const generatetocken = require("../utils/tocken.js");
const bscrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/mail.js");

// ✅ HELPER FUNCTION (Cookie Setting ke liye)
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,       // Production HTTPS ke liye true
        sameSite: "none",   // Cross-domain access ke liye 'none' mandatory hai
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// SIGNUP
// SIGNUP
const signup = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
        if (mobile.length !== 10) return res.status(400).json({ message: "Mobile number must be 10 digits" });

        const hashedpassword = await bscrypt.hash(password, 10);
        
        // ✅ FIX: Location field ko default structure ke saath bhejo
        user = await User.create({ 
            fullname, 
            email, 
            mobile, 
            role, 
            password: hashedpassword,
            location: {
                type: "Point",
                coordinates: [0, 0] // Default longitude, latitude
            }
        });

        const token = generatetocken(user._id);
        setAuthCookie(res, token);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Signup error: ${error.message}` });
    }
};

// SIGNIN
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const ismatch = await bscrypt.compare(password, user.password);
        if (!ismatch) return res.status(400).json({ message: "Password incorrect" });

        const token = generatetocken(user._id);
        setAuthCookie(res, token);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Signin error: ${error.message}` });
    }
};

// SIGNOUT
const signout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
        return res.status(200).json({ message: "Logout Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Signout error: ${error.message}` });
    }
};

// GOOGLE AUTH
// GOOGLE AUTH
const googleauth = async (req, res) => {
    try {
        const { fullname, email, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ 
                fullname, 
                email, 
                mobile, 
                role, 
                password: "google-user-dummy-pass",
                location: { type: "Point", coordinates: [0, 0] } // ✅ FIX: Yahan bhi add kar
            });
        }
        const token = generatetocken(user._id);
        setAuthCookie(res, token);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Googleauth error: ${error.message}` });
    }
};

// OTP functions (Yahan koi badlav nahi, bas try-catch mein 'error' fix kar diya)
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();
        await sendOtpEmail(email, otp);
        return res.status(200).json({ success: true, message: "OTP sent" });
    } catch (error) {
        return res.status(500).json({ message: `OTP error: ${error.message}` });
    }
};

const varifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP Verified" });
    } catch (error) {
        return res.status(500).json({ message: `OTP verify error: ${error.message}` });
    }
};

const resetpassword = async (req, res) => {
    try {
        const { email, newpassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) return res.status(400).json({ message: "OTP not verified" });
        const hashedpassword = await bscrypt.hash(newpassword, 10);
        user.password = hashedpassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Reset error: ${error.message}` });
    }
};

module.exports = { signup, signin, signout, sendOtp, varifyOtp, resetpassword, googleauth };