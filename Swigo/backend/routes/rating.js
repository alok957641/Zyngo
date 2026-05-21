const express = require("express");
const router = express.Router();
const { isAuth } = require("../middelwear/isAuth.js");
const { addRating } = require("../controller/ratingController");


router.post("/add", isAuth, addRating);

module.exports = router;