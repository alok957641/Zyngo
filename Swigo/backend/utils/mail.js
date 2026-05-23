const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // 587 ke liye false rakho
    auth: {
        user: "tumhari-brevo-email@example.com", // Brevo login email
        pass: "yahan-apni-smtp-key-daalo",       // Brevo ki SMTP Key
    },
});

const sendDeliveryOtpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: "tumhari-brevo-email@example.com", // Sender email
            to: email,
            subject: "Delivery OTP - Zyngo",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                    <p>Your OTP for delivery is:</p>
                    <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                </div>
            `
        });
        console.log("Email sent successfully via Brevo to:", email);
    } catch (error) {
        console.error("Brevo Error:", error);
        throw error;
    }
};

module.exports = { sendDeliveryOtpEmail };