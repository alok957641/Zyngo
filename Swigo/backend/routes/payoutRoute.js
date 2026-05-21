const express = require("express");
const { 
    requestPayout, 
    getAllPayoutRequests, 
    approvePayout,
    getMyPayoutRequests, 
    getOwnerWalletBalance // 🔥 YE IMPORT HONA ZAROORI HAI
} = require("../controller/payout.controller");

const {isAuth  }= require("../middelwear/isAuth.js"); 

const payoutRouter = express.Router();

// 🚨 Admin Checker Middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Sirf Admin allowed hai." });
    }
};

// 💰 WALLET & HISTORY ROUTES (Owner/Rider ke liye)
payoutRouter.get("/owner-wallet", isAuth, getOwnerWalletBalance); // 🔥 404 ERROR YAHAN SE FIX HOGA
payoutRouter.get("/my-requests", isAuth, getMyPayoutRequests);
payoutRouter.post("/request", isAuth, requestPayout);

// 👑 ADMIN ROUTES (Secret Page ke liye)
payoutRouter.get("/admin/all", isAuth, isAdmin, getAllPayoutRequests);
payoutRouter.put("/admin/approve/:requestId", isAuth, isAdmin, approvePayout);

module.exports = payoutRouter;