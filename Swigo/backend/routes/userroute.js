const express = require("express");
const userrouter = express.Router();
const { getcurruser, updateUserLocation, toggleAvailabilityStatus } = require("../controller/user.controller.js");
const { isAuth } = require("../middelwear/isAuth.js"); // ✅ Fixed spelling

userrouter.get("/getcurruser", isAuth, getcurruser);
userrouter.post("/update-location", isAuth, updateUserLocation);
userrouter.post("/toggle-availability", isAuth, toggleAvailabilityStatus);

module.exports = userrouter;