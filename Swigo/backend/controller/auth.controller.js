const User = require("../models/user/usermodel.js")
const generatetocken = require("../utils/tocken.js")
const bscrypt = require("bcryptjs");
const { sendOtpEmail} = require("../utils/mail.js");



const signup = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (mobile.length !== 10) {
            return res.status(400).json({ message: "mobile number must be exactly 10 digit long " });
        }

        const hashedpassword = await bscrypt.hash(password, 10);
        user = await User.create({
            fullname,
            email,
            mobile,
            role,
            password: hashedpassword,
        })

        const token = generatetocken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })
        return res.status(201).json(user)

    } catch (error)
    {
        return res.status(500).json({ message: `sign up  error ${error}` });
    }
}


// signin
const signin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const ismatch = await bscrypt.compare(password, user.password)
        if (!ismatch) {
            return res.status(400).json({ message: "password incorrect " });
        }

        const token = generatetocken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })
        console.log(user);
        return res.status(201).json(user)
    } catch (err) {
        return res.status(500).json({ message: ` sign in  error ${err}` });
    }
}



// signout
const signout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logut Sucessfully" });
    } catch (error) {
        return res.status(500).json({ message: ` sign out  error ${error}` });
    }
}


// send otp
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Request for Email:", email); // Step 1

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Bhai, user nahi mila!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        
        console.log("Saving OTP to DB..."); // Step 2
        await user.save();

        console.log("Attempting to send Email..."); // Step 3
        await sendOtpEmail(email, otp); 

        return res.status(200).json({ success: true, message: "OTP sent to email" });

    } catch (error) {
        // 🔥 Ye tere VS Code terminal mein laal rang ka error dikhayega
        console.error("CRITICAL ERROR IN SEND-OTP:", error); 
        return res.status(500).json({ 
            success: false, 
            message: "Email bhejte waqt server fat gaya!",
            debug_error: error.message 
        });
    }
}

// varify otp
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

        return res.status(200).json({ message: "OTP Varified Successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP" })
    }
}

// reset password
const resetpassword = async (req, res) => {

    try {
        const { email, newpassword } = req.body;
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "User Does not Exist or OTP not verified" })
        }

        const hashedpassword = await bscrypt.hash(newpassword, 10);
        user.password = hashedpassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password" });
    }
}


// googlerauth

const googleauth = async (req, res) => {

    try {


        const { fullname, email, mobile ,role} = req.body
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                fullname, email, mobile ,role
            })
        }
        const token = generatetocken(user._id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })

        return res.status(200).json(user)

    } catch (error) {
          return res.status(500).json({ message: ` Googleauth   error ${err}` });
    }

}

module.exports = { signup, signin, signout, sendOtp, varifyOtp, resetpassword , googleauth};