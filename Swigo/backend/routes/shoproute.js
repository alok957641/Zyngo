
const express = require("express");
const shoprouter = express.Router()
const { CreateAndEditShop , getMyShop ,getShopByCity} = require("../controller/shop.controller.js");
const {isAuth} = require("../middelwear/isAuth.js");
const Upload = require("../middelwear/multer.js");


shoprouter.post("/CreateAndEditShop", isAuth ,Upload.single("image") ,CreateAndEditShop );
shoprouter.get("/getMyShop", isAuth , getMyShop);
shoprouter.get("/getShopByCity/:city", getShopByCity);
module.exports = shoprouter;