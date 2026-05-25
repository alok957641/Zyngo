const brevo = require('@getbrevo/brevo');
const dotenv = require("dotenv");
dotenv.config();

// ✅ Brevo Configuration
let apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.ApiKeyAuth, process.env.BREVO_API_KEY);

// ✅ Sender Info (Verify email in Brevo dashboard first)
const sender = {
    name: "Zyngo",
    email: process.env.BREVO_SENDER_EMAIL || "noreply@zyngo.com"
};

// ✅ Send OTP for Password Reset
const sendOtpEmail = async (to, otp) => {
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.subject = "Reset Your Password - Zyngo";
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); padding: 30px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🍔 Zyngo</h1>
                        <p style="color: #ffedd5; margin: 10px 0 0 0; font-size: 14px;">Food Delivery App</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px 25px;">
                        <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Password Reset Request</h2>
                        <p style="color: #475569; line-height: 1.6; margin-bottom: 25px;">
                            We received a request to reset your password. Use the OTP below to proceed.
                        </p>
                        
                        <!-- OTP Box -->
                        <div style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
                            <p style="color: #64748b; font-size: 12px; margin-bottom: 10px; letter-spacing: 1px;">YOUR OTP CODE</p>
                            <div style="font-size: 42px; font-weight: 800; color: #ea580c; letter-spacing: 8px; font-family: monospace;">${otp}</div>
                            <p style="color: #94a3b8; font-size: 11px; margin-top: 12px;">⏰ Valid for 5 minutes</p>
                        </div>
                        
                        <p style="color: #64748b; font-size: 13px; margin-bottom: 5px;">
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                            &copy; 2024 Zyngo. All rights reserved.
                        </p>
                        <p style="color: #cbd5e1; font-size: 10px; margin: 5px 0 0 0;">
                            Delivering Happiness to Your Doorstep
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ OTP Email sent to:", to);
        return response;
    } catch (error) {
        console.error("❌ Brevo OTP Email Error:", error.response?.body || error.message);
        throw new Error("Failed to send OTP email");
    }
};

// ✅ Send Delivery OTP for Rider
const sendDeliveryOtpEmail = async (user, otp) => {
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: user.email, name: user.fullname }];
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.subject = "Delivery OTP - Zyngo";
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 30px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🛵 Zyngo Delivery</h1>
                        <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 14px;">Your order is almost there!</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px 25px;">
                        <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Hello ${user.fullname || "Customer"}! 👋</h2>
                        <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                            Your delivery partner is at your location. Please share this OTP to complete the delivery.
                        </p>
                        
                        <!-- OTP Box -->
                        <div style="background-color: #fef2f2; border: 2px dashed #dc2626; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
                            <p style="color: #64748b; font-size: 12px; margin-bottom: 10px; letter-spacing: 1px;">DELIVERY OTP</p>
                            <div style="font-size: 46px; font-weight: 800; color: #dc2626; letter-spacing: 10px; font-family: monospace;">${otp}</div>
                            <p style="color: #94a3b8; font-size: 11px; margin-top: 12px;">
                                ⏰ Valid for 10 minutes | 🔐 Keep this code confidential
                            </p>
                        </div>
                        
                        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 15px; border-radius: 8px; margin-top: 20px;">
                            <p style="color: #166534; font-size: 12px; margin: 0;">
                                💡 <strong>Important:</strong> Only share this OTP with your delivery partner when you receive your order.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                            © 2024 Zyngo. All rights reserved.
                        </p>
                        <p style="color: #cbd5e1; font-size: 10px; margin: 5px 0 0 0;">
                            Need help? Contact us at support@zyngo.com
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Delivery OTP Email sent to:", user.email);
        return response;
    } catch (error) {
        console.error("❌ Brevo Delivery OTP Error:", error.response?.body || error.message);
        throw new Error("Failed to send delivery OTP");
    }
};

// ✅ Test Function (Optional - For testing only)
const testEmail = async () => {
    try {
        await sendOtpEmail("test@example.com", "123456");
        console.log("Test email sent successfully!");
    } catch (error) {
        console.error("Test failed:", error);
    }
};

module.exports = { sendOtpEmail, sendDeliveryOtpEmail, testEmail };