// routes/adminRoute.js
const express = require("express");
const { getAdminStats , getAllRiders} = require("../controller/adminController.js");
const { isAuth, isAdmin } = require("../middelwear/isAuth.js");

const router = express.Router();

router.get("/stats", isAuth, isAdmin, getAdminStats); 
router.get("/riders/all", isAuth, isAdmin, getAllRiders);
module.exports = router; // 👈 export default ki jagah ye