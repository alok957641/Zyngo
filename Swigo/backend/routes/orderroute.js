const express = require("express");
// Ab hum 'isDeliveryBoy' middleware bhi import karenge
const { isAuth, isDeliveryBoy } = require("../middelwear/isAuth"); 

const {
    placeOrder, 
    getMyOrders, 
    updateOrderStatus, 
    getDeliveryBoyAssignment, 
    acceptOrder, 
    getCurrentOrder, 
    getOrderById, 
    sendDeliveryOtp, 
    verifyDeliveryOtp,
    verifyPayment,
    getRiderStats,
    getRiderHistory,
    riderPayDebtOrder, 
    verifyRiderDebtPayment
} = require("../controller/order.controller");

const orderrouter = express.Router();

// 🛒 Customer Routes
orderrouter.post("/place-order", isAuth, placeOrder);
orderrouter.get("/my-orders", isAuth, getMyOrders);
orderrouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);

// 🏪 Owner Routes (Yahan check kar lena ki sirf owner hi update kare)
orderrouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);

// 🏍️ Delivery Boy Routes (Ab yahan isDeliveryBoy middleware zaroori hai!)
orderrouter.get("/get-delivery-assignments", isAuth, isDeliveryBoy, getDeliveryBoyAssignment); 
orderrouter.get("/get-assignment", isAuth, isDeliveryBoy, getDeliveryBoyAssignment);
orderrouter.get("/get-current-order", isAuth, isDeliveryBoy, getCurrentOrder);
orderrouter.post("/accept-order/:assignmentId", isAuth, isDeliveryBoy, acceptOrder);

// 🔐 OTP Flow (Delivery boy se related hai)
orderrouter.post("/send-delivery-otp", isAuth, isDeliveryBoy, sendDeliveryOtp);
orderrouter.post("/verify-otp", isAuth, isDeliveryBoy, verifyDeliveryOtp);

// Rider Stats & Debt
orderrouter.post("/verify-payment", isAuth, isDeliveryBoy, verifyPayment);
orderrouter.get("/rider-pay-debt", isAuth, isDeliveryBoy, riderPayDebtOrder);
orderrouter.post("/verify-rider-debt", isAuth, isDeliveryBoy, verifyRiderDebtPayment);
orderrouter.get("/rider-stats", isAuth, isDeliveryBoy, getRiderStats);
orderrouter.get("/rider-history", isAuth, isDeliveryBoy, getRiderHistory);

module.exports = orderrouter;