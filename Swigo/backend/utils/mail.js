const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,  // App Password, not regular password!
    },
});

// ✅ Send OTP for Password Reset
const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: to,
            subject: "Reset Your Password - Zyngo",
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color: #ea580c;">Zyngo Password Reset</h2>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: gray;">Valid for 5 minutes.</p>
                </div>
            `
        });
        console.log("✅ OTP Email sent to:", to);
    } catch (error) {
        console.error("❌ Email Error:", error);
        throw new Error("Failed to send email");
    }
};

// ✅ Send Delivery OTP for Rider
const sendDeliveryOtpEmail = async (user, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: user.email,
            subject: "Delivery OTP - Zyngo",
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                    <p>Your OTP for delivery is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: gray;">Valid for 10 minutes.</p>
                </div>
            `
        });
        console.log("✅ Delivery OTP Email sent to:", user.email);
    } catch (error) {
        console.error("❌ Delivery Email Error:", error);
        throw new Error("Failed to send delivery OTP");
    }
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail };