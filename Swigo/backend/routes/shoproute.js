const express = require("express");
const shoprouter = express.Router();
const { isAuth } = require("../middelwear/isAuth.js"); 
const Upload = require("../middelwear/multer.js"); 

const { 
    CreateAndEditShop, 
    getMyShop, 
    getShopByCity 
} = require("../controller/shop.controller.js");

// ✅ Protected Routes
shoprouter.post("/CreateAndEditShop", isAuth, Upload.single("image"), CreateAndEditShop);
shoprouter.get("/getMyShop", isAuth, getMyShop);

// ✅ Public Routes
shoprouter.get("/getShopByCity/:city", getShopByCity);

module.exports = shoprouter;