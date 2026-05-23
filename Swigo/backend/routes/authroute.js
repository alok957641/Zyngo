
const express = require("express");
const { signup, signin, signout, sendOtp, verifyOtp, resetPassword, googleAuth} = require("../controller/auth.controller");
const router =express.Router()


router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/varifyOtp", verifyOtp);
router.post("/resetpassword", resetPassword);
router.post("/googleauth", googleAuth);

module.exports = router;