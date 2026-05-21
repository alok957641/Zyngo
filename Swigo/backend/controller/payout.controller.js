const PayoutRequest = require("../models/payout/payoutModel");
const User = require("../models/user/usermodel");
const Shop = require("../models/shop/shopmodel"); 
const Order = require("../models/order/orderModel"); 

// ==========================================
// 1. Request Payout (Rider & Owner Dono Ke Liye Validation 🔥)
// ==========================================
exports.requestPayout = async (req, res) => {
    try {
        const userId = req.user?._id; 
        const { amount, paymentMethodInfo } = req.body;

        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: "User ki identity nahi mil rahi hai, fir se login karein!" });
        }

        if (!amount || !paymentMethodInfo) {
            return res.status(400).json({ success: false, message: "Bhai, Amount aur UPI details dono bharna zaroori hai!" });
        }

        const requestedAmount = Number(amount);
        if (requestedAmount <= 0) {
            return res.status(400).json({ success: false, message: "Bhai, sahi amount daalo (0 se bada)!" });
        }

        // Fix: safe check for role
        let userRole = req.user.role ? req.user.role.toLowerCase() : "";
        if (userRole === "rider") userRole = "deliveryboy";

        // 🚀 LIVE WALLET CHECK: Pehle check karo user ke paas utna balance hai ya nahi
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User database mein nahi mila!" });
        }

        // Validation for Rider
        if (userRole === "deliveryboy" && (currentUser.wallet || 0) < requestedAmount) {
            return res.status(400).json({ success: false, message: `Bhai wallet mein पर्याप्त balance nahi hai! Current Balance: ₹${currentUser.wallet || 0}` });
        }

        const newRequest = await PayoutRequest.create({
            user: userId,
            role: userRole,
            amount: requestedAmount,
            paymentMethodInfo: paymentMethodInfo,
            status: "pending"
        });

        res.status(201).json({ success: true, message: "Request bhej di gayi hai! 🚀", request: newRequest });

    } catch (error) {
        console.error("❌ Payout Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. Get All Requests (SIRF ADMIN KE LIYE)
// ==========================================
exports.getAllPayoutRequests = async (req, res) => {
    try {
        // Pending wali sorting se upar dikhengi automatically
        const requests = await PayoutRequest.find()
            .populate("user", "fullname mobile email")
            .sort({ status: -1, createdAt: -1 });

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. Approve Payout (Asli Real-time Wallet Deduction Trigger 🔥)
// ==========================================
exports.approvePayout = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await PayoutRequest.findById(requestId);
        if (!request) return res.status(404).json({ success: false, message: "Request nahi mili!" });
        if (request.status !== "pending") return res.status(400).json({ success: false, message: "Bhai ye request pehle hi process ho chuki hai!" });

        // 🚀 TRANSACTION SECURITY: User ka account dhoondo aur wallet se utna amount minus karo
        const targetUser = await User.findById(request.user);
        if (targetUser) {
            await User.findByIdAndUpdate(request.user, {
                $inc: { wallet: -request.amount } // Database wallet se automatic deduct ho jayega
            });
            console.log(`🎉 Payout Deducted: ₹${request.amount} cut from ${targetUser.fullname}'s wallet.`);
        }

        request.status = "completed";
        request.processedAt = Date.now();
        await request.save();

        res.status(200).json({ success: true, message: "Paisa set! Status Completed ho gaya aur wallet updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. Get My Payout Requests (Rider/Owner History)
// ==========================================
exports.getMyPayoutRequests = async (req, res) => {
    try {
        const requests = await PayoutRequest.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 5. Get REAL Wallet Balance (Shop Owner Array Engine - Safe & Intact 💎)
// ==========================================
exports.getOwnerWalletBalance = async (req, res) => {
    try {
        const userId = req.user._id;

        // STEP 1: Total nikala hua paisa
        const payouts = await PayoutRequest.find({ 
            user: userId, 
            status: { $ne: "rejected" } 
        });
        const totalWithdrawn = payouts.reduce((sum, req) => sum + req.amount, 0);

        // STEP 2: Shop dhoondo
        const myShop = await Shop.findOne({ owner: userId }); 
        if (!myShop) {
            return res.status(200).json({ success: true, netBalance: 0, message: "Shop nahi mili" });
        }

        // STEP 3: Array Match Engine ($elemMatch)
        const myOrders = await Order.find({ 
            shopOrders: {
                $elemMatch: {
                    shop: myShop._id,
                    status: "delivered" 
                }
            }
        });

        // STEP 4: Total Sales calculation loop
        let totalSales = 0;
        myOrders.forEach(order => {
            const myShopOrder = order.shopOrders.find(o => o.shop.toString() === myShop._id.toString());
            
            if (myShopOrder) {
                totalSales += myShopOrder.total || order.totalAmount; 
            }
        });

        // STEP 5: 20% Commission cutting logic
        const netEarnings = totalSales * 0.8; 

        // STEP 6: Final Dynamic Balance
        const availableBalance = netEarnings - totalWithdrawn;

        res.status(200).json({ 
            success: true, 
            netBalance: availableBalance > 0 ? availableBalance : 0,
            debugTotalSales: totalSales 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};