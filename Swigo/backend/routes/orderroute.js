const express = require("express");
const {isAuth} = require("../middelwear/isAuth"); // 🚨 Check kar lena spelling 'middelwear' sahi hai ya 'middleware'
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

// 🏪 Owner Routes
orderrouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);

// 🏍️ Delivery Boy Routes
// 🚨 Frontend isi URL ko call kar raha hai, iska upar hona zaroori hai
orderrouter.get("/get-delivery-assignments", isAuth, getDeliveryBoyAssignment); 
orderrouter.get("/get-assignment", isAuth, getDeliveryBoyAssignment); // Legacy support
orderrouter.get("/get-current-order", isAuth, getCurrentOrder);
orderrouter.post("/accept-order/:assignmentId", isAuth, acceptOrder);

// 🔐 OTP Flow
orderrouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderrouter.post("/verify-otp", isAuth, verifyDeliveryOtp);

orderrouter.post("/verify-payment", isAuth, verifyPayment);
orderrouter.get("/rider-pay-debt", isAuth, riderPayDebtOrder);
orderrouter.post("/verify-rider-debt", isAuth, verifyRiderDebtPayment);

orderrouter.get("/rider-stats", isAuth, getRiderStats);
orderrouter.get("/rider-history", isAuth, getRiderHistory);
module.exports = orderrouter;