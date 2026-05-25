const dotenv = require("dotenv");
dotenv.config();

// ✅ ES Module style import ko CommonJS (require) mein aise handle karo
const brevo = require('@getbrevo/brevo');

// ✅ Constructor ko direct access karo
const apiInstance = new brevo.TransactionalEmailsApi();

// ✅ API Key set karne ka v5.x tareeka
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
// --- DEBUG: Checking Config ---
console.log("🛠 [MAIL DEBUG] Initializing Brevo...");
console.log("🛠 [MAIL DEBUG] API Key Loaded:", process.env.BREVO_API_KEY ? "YES" : "NO");



const sender = {
    name: "Zyngo",
    email: process.env.BREVO_SENDER_EMAIL || "zyngo7541@gmail.com"
};

const sendOtpEmail = async (to, otp) => {
    console.log(`📩 [MAIL DEBUG] Attempting to send OTP email to: ${to}`);
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Reset Your Password - Zyngo";
        sendSmtpEmail.htmlContent = `<h1>OTP: ${otp}</h1>`;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: to }];
        
        console.log("📩 [MAIL DEBUG] Calling API...");
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        console.log("✅ [MAIL DEBUG] Success! Response:", JSON.stringify(response.body));
        return response;
    } catch (error) {
        // 🔥 Yahan error ki asli wajah khul kar aayegi
        console.error("❌ [MAIL DEBUG] API FAILED!");
        if (error.response) {
            console.error("❌ [MAIL DEBUG] Response Body:", JSON.stringify(error.response.body));
        } else {
            console.error("❌ [MAIL DEBUG] Raw Error:", error.message);
        }
        throw new Error("Failed to send email");
    }
};



// ✅ Send Delivery OTP for Rider
const sendDeliveryOtpEmail = async (user, otp) => {
    console.log(`📩 [MAIL DEBUG] Attempting to send delivery OTP email to: ${user.email}`);
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Delivery OTP - Zyngo";
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ea580c;">Zyngo Delivery OTP</h2>
                <p>Your OTP for delivery is:</p>
                <h1 style="color: #dc2626; letter-spacing: 5px;">${otp}</h1>
                <p style="color: #666; font-size: 12px;">This OTP will expire in 10 minutes.</p>
            </div>
        `;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ email: user.email, name: user.fullname || "Customer" }];
        
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Delivery OTP Email sent to:", user.email);
        return response;
    } catch (error) {
        console.error("❌ Brevo Error:", error.response?.body || error.message);
        throw new Error("Failed to send delivery OTP");
    }
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail };