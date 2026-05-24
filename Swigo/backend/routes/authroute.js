const express = require("express");
const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth , getMe } = require("../controller/auth.controller");
const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);  // ✅ Fixed spelling
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);

router.get("/me", isAuth, getMe);

module.exports = router;