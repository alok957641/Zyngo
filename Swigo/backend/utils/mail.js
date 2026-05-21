const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();



// console.log("Email from Env:", process.env.EMAIL);
// console.log("Pass from Env:", process.env.PASS ? "Received" : "Not Received");
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465 , 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS, 
    },
});

const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL, 
            to: to,
            subject: "RESET Your Password - Swigo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Swigo Password Reset</h2>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
                </div>
            `
        });
        console.log("Email sent successfully to:", to);
    } catch (error) {
        console.error("Nodemailer Error:", error);
        throw new Error("Failed to send email");
    }
}


const sendDeliveryOtpEmail = async (user, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL, 
            to: user.email,
            subject: "Delivery OTP - Swigo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Swigo Delivery OTP</h2>
                    <p>Your OTP for delivery is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
                </div>
            `
        });
        console.log("Email sent successfully to:", user.email);
    } catch (error) {
        console.error("Nodemailer Error:", error);
        throw new Error("Failed to send email");
    }
}

module.exports = {sendOtpEmail, sendDeliveryOtpEmail};