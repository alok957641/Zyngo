const express = require("express");
const shoprouter = express.Router();
const { isAuth } = require("../middelwear/isAuth.js"); 
const Upload = require("../middelwear/multer.js"); 
const { CreateAndEditShop, getMyShop, getShopByCity } = require("../controller/shop.controller.js");

// ✅ CREATE/EDIT SHOP
shoprouter.post("/CreateAndEditShop", isAuth, Upload.single("image"), CreateAndEditShop);

// ✅ GET MY SHOP - YEH LINE ADD KARO (MISSING HAI)
shoprouter.get("/getMyShop", isAuth, getMyShop);

// ✅ GET SHOPS BY CITY
shoprouter.get("/getShopByCity/:city", getShopByCity);

console.log("✅ Shop routes registered: /getMyShop, /CreateAndEditShop, /getShopByCity/:city");

module.exports = shoprouter;