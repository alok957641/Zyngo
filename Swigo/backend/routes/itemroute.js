
const express = require("express");
const itemrouter = express.Router()
const {AddItem, EditItem, getitembyid , deleteitem , getItembycity} = require("../controller/item.controller.js");
const upload = require("../middelwear/multer.js");
const {isAuth} = require("../middelwear/isAuth.js")



itemrouter.post("/AddItem", isAuth,upload.single("image") , AddItem);
itemrouter.put("/EditItem/:id", isAuth, upload.single("image"), EditItem);
itemrouter.get("/getbyid/:itemId", isAuth, getitembyid);
itemrouter.delete("/delete/:itemId", isAuth, deleteitem);
itemrouter.get("/getbycity/:city", getItembycity); 

module.exports = itemrouter;