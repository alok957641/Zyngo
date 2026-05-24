const express = require("express");
const shoprouter = express.Router();
const { isAuth } = require("../middelwear/isAuth.js"); 
const Upload = require("../middelwear/multer.js"); 
const { CreateAndEditShop, getMyShop, getShopByCity } = require("../controller/shop.controller.js");

shoprouter.post("/CreateAndEditShop", isAuth, (req, res, next) => {
    console.log("CreateAndEditShop Route Triggered");
    next();
}, Upload.single("image"), CreateAndEditShop);

shoprouter.get("/getMyShop", isAuth, (req, res, next) => {
    console.log("getMyShop Route Triggered");
    next();
}, getMyShop);

shoprouter.get("/getShopByCity/:city", (req, res, next) => {
    console.log("getShopByCity Route Triggered for:", req.params.city);
    next();
}, getShopByCity);

module.exports = shoprouter;