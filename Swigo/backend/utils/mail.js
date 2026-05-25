const dotenv = require("dotenv");
dotenv.config();

// ✅ Simple Brevo Setup - Jo bhi version ho, kaam karega
let brevo;
try {
    brevo = require('@getbrevo/brevo');
} catch (e) {
    brevo = require('sib-api-v3-sdk');
}

// ✅ Configure API Key
const defaultClient = (brevo.ApiClient || brevo).instance;
if (defaultClient) {
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
}

const apiInstance = new (brevo.TransactionalEmailsApi || brevo.TransactionalEmailsApi)();

// ✅ Sender Info
const sender = {
    name: "Zyngo",
    email: process.env.BREVO_SENDER_EMAIL || "zyngo7541@gmail.com"
};

// ✅ Send OTP for Password Reset
const sendOtpEmail = async (to, otp) => {
    try {
        const SendSmtpEmail = brevo.SendSmtpEmail;
        let sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.subject = "Reset Your Password - Zyngo";
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ea580c;">Zyngo Password Reset</h2>
                <p>Your OTP for password reset is:</p>
                <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
            </div>
        `;
        
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ OTP Email sent to:", to);
    } catch (error) {
        console.error("❌ Brevo Error:", error.response?.body || error.message);
        throw new Error("Failed to send email");
    }
};

// ✅ Send Delivery OTP for Rider
const sendDeliveryOtpEmail = async (user, otp) => {
    try {
        const SendSmtpEmail = brevo.SendSmtpEmail;
        let sendSmtpEmail = new SendSmtpEmail();
        sendSmtpEmail.to = [{ email: user.email, name: user.fullname || "Customer" }];
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.subject = "Delivery OTP - Zyngo";
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                <p>Your OTP for delivery is:</p>
                <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
            </div>
        `;
        
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Delivery OTP Email sent to:", user.email);
    } catch (error) {
        console.error("❌ Brevo Error:", error.response?.body || error.message);
        throw new Error("Failed to send delivery OTP");
    }
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail };