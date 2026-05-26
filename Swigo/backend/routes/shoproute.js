const express = require("express");
const shoprouter = express.Router();
const { isAuth } = require("../middelwear/isAuth.js"); 
const Upload = require("../middelwear/multer.js"); 
const { CreateAndEditShop, getMyShop, getShopByCity } = require("../controller/shop.controller.js");

// ✅ CREATE/EDIT SHOP
shoprouter.post("/CreateAndEditShop", isAuth, Upload.single("image"), CreateAndEditShop);

// ✅ GET MY SHOP (YEH ADD KARO - MISSING THA)
shoprouter.get("/getMyShop", isAuth, getMyShop);

// ✅ GET SHOPS BY CITY
shoprouter.get("/getShopByCity/:city", getShopByCity);

module.exports = shoprouter;