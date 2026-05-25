// const dotenv = require("dotenv");
// dotenv.config();

// // ✅ Brevo v5.0+ compatible code
// const brevo = require('@getbrevo/brevo');

// // ✅ Correct way to set API Key (v5.0+)
// const apiInstance = new brevo.TransactionalEmailsApi();
// apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// // ✅ Sender Info
// const sender = {
//     name: "Zyngo",
//     email: process.env.BREVO_SENDER_EMAIL || "zyngo7541@gmail.com"
// };

// // ✅ Send OTP for Password Reset
// const sendOtpEmail = async (to, otp) => {
//     try {
//         let sendSmtpEmail = new brevo.SendSmtpEmail();
//         sendSmtpEmail.subject = "Reset Your Password - Zyngo";
//         sendSmtpEmail.htmlContent = `
//             <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
//                 <h2 style="color: #ea580c;">Zyngo Password Reset</h2>
//                 <p>Your OTP for password reset is:</p>
//                 <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
//                 <p style="color: #666; font-size: 12px;">This OTP will expire in 5 minutes.</p>
//             </div>
//         `;
//         sendSmtpEmail.sender = sender;
//         sendSmtpEmail.to = [{ email: to }];
        
//         const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log("✅ OTP Email sent to:", to);
//         return response;
//     } catch (error) {
//         console.error("❌ Brevo Error:", error.response?.body || error.message);
//         throw new Error("Failed to send email");
//     }
// };

// // ✅ Send Delivery OTP for Rider
// const sendDeliveryOtpEmail = async (user, otp) => {
//     try {
//         let sendSmtpEmail = new brevo.SendSmtpEmail();
//         sendSmtpEmail.subject = "Delivery OTP - Zyngo";
//         sendSmtpEmail.htmlContent = `
//             <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
//                 <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
//                 <p>Your OTP for delivery is:</p>
//                 <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
//                 <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
//             </div>
//         `;
//         sendSmtpEmail.sender = sender;
//         sendSmtpEmail.to = [{ email: user.email, name: user.fullname || "Customer" }];
        
//         const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log("✅ Delivery OTP Email sent to:", user.email);
//         return response;
//     } catch (error) {
//         console.error("❌ Brevo Error:", error.response?.body || error.message);
//         throw new Error("Failed to send delivery OTP");
//     }
// };

// module.exports = { sendOtpEmail, sendDeliveryOtpEmail };