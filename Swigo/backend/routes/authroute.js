const express = require("express");
const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth, getMe, updateProfile } = require("../controller/auth.controller");
const jwt = require("jsonwebtoken");
const User = require("../models/user/usermodel.js");
const { isAuth } = require("../middelwear/isAuth.js");
const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/varifyOtp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);

router.get("/me", isAuth, getMe);
router.put("/profile", isAuth, updateProfile);

module.exports = router;
