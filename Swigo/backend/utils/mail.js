const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// ✅ Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // App Password, not regular password!
    },
});

// ✅ Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mail transporter error:", error);
    } else {
        console.log("✅ Mail transporter ready!");
    }
});

// ✅ Send OTP for Password Reset
const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: `"Zyngo" <${process.env.GMAIL_EMAIL}>`,
            to: to,
            subject: "Reset Your Password - Zyngo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Zyngo Password Reset</h2>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
                </div>
            `
        });
        console.log("✅ OTP Email sent to:", to);
    } catch (error) {
        console.error("❌ Email Error:", error.message);
        throw new Error("Failed to send email");
    }
};

// ✅ Send Delivery OTP for Rider
const sendDeliveryOtpEmail = async (user, otp) => {
    try {
        await transporter.sendMail({
            from: `"Zyngo Delivery" <${process.env.GMAIL_EMAIL}>`,
            to: user.email,
            subject: "Delivery OTP - Zyngo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                    <p>Your OTP for delivery is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
                </div>
            `
        });
        console.log("✅ Delivery OTP Email sent to:", user.email);
    } catch (error) {
        console.error("❌ Delivery Email Error:", error.message);
        throw new Error("Failed to send delivery OTP");
    }
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail };