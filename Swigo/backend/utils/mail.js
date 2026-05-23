// utils/mail.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendDeliveryOtpEmail = async (email, otp) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Resend ka default (tum apna domain verify kar sakte ho baad mein)
            to: email,
            subject: 'Delivery OTP - Zyngo',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                    <p>Your OTP for delivery is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                    <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
                </div>
            `
        });
        console.log("Email sent successfully via Resend to:", email);
    } catch (error) {
        console.error("Resend Error:", error);
        throw error;
    }
};

module.exports = { sendDeliveryOtpEmail };