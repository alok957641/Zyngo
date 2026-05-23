const User = require("../models/user/usermodel.js");
const generatetocken = require("../utils/tocken.js");
const bscrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/mail.js");

// ✅ FINAL COOKIE FIX
const setAuthCookie = (res, token) => {

    res.cookie("token", token, {

        httpOnly: true,

        secure: true,

        sameSite: "none",

        maxAge: 7 * 24 * 60 * 60 * 1000,

    });

};

// signup
const signup = async (req, res) => {
    try {
        console.log("--- SIGNUP START ---");
        const { fullname, email, password, mobile, role } = req.body;
        console.log("Data received:", { fullname, email, mobile, role });

        // Check if user exists
        console.log("Checking if user exists...");
        let user = await User.findOne({ email });
        if (user) {
            console.log("User already exists!");
            return res.status(400).json({ message: "User already exists" });
        }

        // Validate password length
        if (!password || password.length < 6) {
            console.log("Password validation failed");
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validate mobile string length
        console.log("Validating mobile:", mobile);
        if (!mobile || mobile.toString().length !== 10) {
            console.log("Mobile validation failed");
            return res.status(400).json({ message: "mobile number must be exactly 10 digit long" });
        }

        console.log("Hashing password...");
        const hashedpassword = await bscrypt.hash(password, 10);

        console.log("Creating user in DB...");
        user = await User.create({
            fullname,
            email,
            mobile,
            role,
            password: hashedpassword,
        });
        console.log("User created successfully:", user._id);

        const token = generatetocken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        
        return res.status(201).json(user);

    } catch (error) {
        // 🔥 Ye line sabse important hai. 
        // Render ke Logs mein yahi error dikhega.
        console.error("CRITICAL ERROR IN SIGNUP:", error); 
        return res.status(500).json({ message: `signup error: ${error.message}` });
    }
}


// SIGNIN
const signin = async (req, res) => {
    try {
        console.log("--- SIGNIN START ---");
        const { email, password } = req.body;
        console.log("Signin attempt for email:", email);

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }
        console.log("User found in DB, verifying password...");

        // 2. Check if user has a password (kabhi kabhi DB mein password field empty ho sakti hai)
        if (!user.password) {
            console.log("CRITICAL: User found but no password in DB!");
            return res.status(400).json({ message: "Password not set for this account" });
        }

        // 3. Compare password
        const isMatch = await bscrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for email:", email);
            return res.status(400).json({ message: "Password incorrect" });
        }
        console.log("Password matched!");

        // 4. Generate Token
        const token = generatetocken(user._id);
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        const userObj = user.toObject();
        delete userObj.password; // Security: password mat bhejo
        console.log("Signin successful for:", userObj._id);

        return res.status(200).json(userObj);

    } catch (err) {
        // 🔥 Asli error yahan pakda jayega
        console.error("CRITICAL ERROR IN SIGNIN:", err);
        return res.status(500).json({ message: `Signin error: ${err.message}` });
    }
}


// SIGNOUT
const signout = async (req, res) => {

    try {

        res.clearCookie("token", {
            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite:
                process.env.NODE_ENV === "production"
                    ? "None"
                    : "Lax",

            path: "/"
        });

        return res.status(200).json({
            message: "Logout Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: `Signout error: ${error.message}`
        });

    }

};

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

                location: {
                    type: "Point",
                    coordinates: [0, 0]
                }
            });

        }

        const token = generatetocken(user._id);

        setAuthCookie(res, token);

        return res.status(200).json(user);

    } catch (error) {

        return res.status(500).json({
            message: `Googleauth error: ${error.message}`
        });

    }

};

// OTP SEND
const sendOtp = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.resetOtp = otp;

        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent"
        });

    } catch (error) {

        return res.status(500).json({
            message: `OTP error: ${error.message}`
        });

    }

};

// VERIFY OTP
const varifyOtp = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (
            !user ||
            user.resetOtp !== otp ||
            user.otpExpiry < Date.now()
        ) {

            return res.status(400).json({
                message: "Invalid or Expired OTP"
            });

        }

        user.isOtpVerified = true;

        user.resetOtp = undefined;

        user.otpExpiry = undefined;

        await user.save();

        return res.status(200).json({
            message: "OTP Verified"
        });

    } catch (error) {

        return res.status(500).json({
            message: `OTP verify error: ${error.message}`
        });

    }

};

// RESET PASSWORD
const resetpassword = async (req, res) => {

    try {

        const { email, newpassword } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {

            return res.status(400).json({
                message: "OTP not verified"
            });

        }

        const hashedpassword = await bscrypt.hash(newpassword, 10);

        user.password = hashedpassword;

        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({
            message: "Password Reset Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: `Reset error: ${error.message}`
        });

    }

};

module.exports = {
    signup,
    signin,
    signout,
    sendOtp,
    varifyOtp,
    resetpassword,
    googleauth
};