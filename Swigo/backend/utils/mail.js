const nodemailer = require("nodemailer");
const { TransactionalEmailsApi, SendSmtpEmail } = require('@getbrevo/brevo');

const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || (smtpUser ? "smtp.gmail.com" : "");
const smtpPort = Number(process.env.SMTP_PORT || 587);

const sender = {
    name: "Zyngo",
    email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || smtpUser || "zyngo7541@gmail.com"
};

const buildOtpHtml = (title, otp, minutes) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ea580c;">${title}</h2>
        <p>Your OTP is:</p>
        <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
        <p style="color: #666; font-size: 12px;">This OTP will expire in ${minutes} minutes.</p>
    </div>
`;

const sendWithBrevo = async ({ to, name, subject, html }) => {
    try {
        const apiInstance = new TransactionalEmailsApi();
        apiInstance.setApiKey(process.env.BREVO_API_KEY);

        const email = new SendSmtpEmail();
        email.subject = subject;
        email.htmlContent = html;
        email.sender = sender;
        email.to = [{ email: to, name: name || "Customer" }];

        const response = await apiInstance.sendTransacEmail(email);
        console.log("✅ Brevo email sent:", response);
        return response;
    } catch (error) {
        console.error("❌ Brevo send error:", error.response?.body || error.message);
        throw error;
    }
};


const sendWithSmtp = async ({ to, name, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    return transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: name ? `"${name}" <${to}>` : to,
        subject,
        html
    });
};

const sendEmail = async (payload) => {
    if (process.env.BREVO_API_KEY) return sendWithBrevo(payload);

    if (smtpHost && smtpUser && smtpPass) {
        return sendWithSmtp(payload);
    }

    throw new Error("Email service is not configured. Add BREVO_API_KEY or Gmail SMTP credentials in backend .env");
};

const sendOtpEmail = async (to, otp) => {
    return sendEmail({
        to,
        subject: "Reset Your Password - Zyngo",
        html: buildOtpHtml("Zyngo Password Reset", otp, 5)
    });
};

const sendDeliveryOtpEmail = async (user, otp) => {
    return sendEmail({
        to: user.email,
        name: user.fullname || "Customer",
        subject: "Delivery OTP - Zyngo",
        html: buildOtpHtml("Zyngo Delivery OTP", otp, 10)
    });
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail };
