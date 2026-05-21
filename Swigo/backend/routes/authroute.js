
const express = require("express");
const { signup, signin, signout ,sendOtp , varifyOtp , resetpassword, googleauth} = require("../controller/auth.controller");
const router =express.Router()


router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/sendOtp", sendOtp);
router.post("/varifyOtp", varifyOtp);
router.post("/resetpassword", resetpassword);
router.post("/googleauth", googleauth);

module.exports = router;