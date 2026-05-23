const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();



// console.log("Email from Env:", process.env.EMAIL);
// console.log("Pass from Env:", process.env.PASS ? "Received" : "Not Received");
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // 465 port ke liye true
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
    // 🔥 YE ADD KARO: Connection timeout badha do
    connectionTimeout: 10000, 
    socketTimeout: 10000,
});

const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL, 
            to: to,
            subject: "RESET Your Password - Zyngo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Zyngo Password Reset</h2>
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


const sendDeliveryOtpEmail = async (email, otp) => { 
    try {
        if (!email) throw new Error("Email address is missing");

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email, // Directly email string use karo
            subject: "Delivery OTP - Zyngo",
            html: `...`
        });
        console.log("Email sent successfully to:", email);
    } catch (error) {
        console.error("Nodemailer Error:", error);
        throw error; // Error ko throw karo taaki controller mein catch ho
    }
}

module.exports = {sendOtpEmail, sendDeliveryOtpEmail};