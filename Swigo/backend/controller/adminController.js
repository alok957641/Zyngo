// controllers/adminController.js
const User = require("../models/user/usermodel.js");
const Shop = require("../models/shop/shopmodel.js");
const Order = require("../models/order/ordermodel.js");

const getAdminStats = async (req, res) => {
    try {
        // 🔥 Real DB counts
        const [totalUsers, totalShops, totalRiders, activeOrders] = await Promise.all([
            User.countDocuments({ role: "user" }),
            Shop.countDocuments(),
            User.countDocuments({ role: "deliveryboy" }), 
            Order.countDocuments({ status: { $ne: "delivered" } }) 
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalShops,
                totalRiders,
                activeOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// controllers/adminController.js

const getAllRiders = async (req, res) => {
    try {
        // 🔥 Database ke hisaab se "deliveryboy" (bina space ke) kar diya
        const riders = await User.find({ role: "deliveryboy" }).select("-password");
        
        console.log("Riders found from DB:", riders.length); // Testing ke liye log

        res.status(200).json({
            success: true,
            riders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// module.exports mein isey add karna mat bhulna:
module.exports = { getAdminStats, getAllRiders };

