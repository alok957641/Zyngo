const Item = require("../models/shop/itemmodel");
const Shop = require("../models/shop/shopmodel");
const uploadoncloudinary = require("../utils/cloudinary");

const AddItem = async (req, res) => {
    try {
        const { name, category, price, foodType } = req.body;
        const ownerId = req.user?._id || req.userId || req.id;

        if (!ownerId) return res.status(401).json({ message: "User not authenticated" });

        let image;
        if (req.file) {
            // ✅ FIX: Buffer ko handle karne ke liye uploadoncloudinary 
            // agar path leta hai, toh yahan logic change karna hoga.
            // Agar cloudinary upload function buffer leta hai toh:
            const cloudResponse = await uploadoncloudinary(req.file.buffer); 
            image = cloudResponse?.secure_url;
        }

        const shop = await Shop.findOne({ owner: ownerId });
        if (!shop) return res.status(404).json({ message: "Bhai, pehle restaurant register karo!" });

        const item = await Item.create({
            name, category, price, foodType, image, shop: shop._id 
        });

        shop.items.push(item._id);
        await shop.save();

        const updatedShop = await Shop.findById(shop._id).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(201).json(updatedShop);
    } catch (error) {
        console.log("❌ Add Item Error:", error);
        return res.status(500).json({ message: `Add Item Error: ${error.message}` });
    }
};


const EditItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, category, price, foodType } = req.body;
        const ownerId = req.user?._id || req.userId || req.id;

        const updateData = { name, category, price, foodType };

        // ✅ FIX: Agar file hai, toh 'buffer' bhejo, 'path' nahi
        if (req.file) {
            console.log("Uploading file to Cloudinary...");
            const cloudResponse = await uploadoncloudinary(req.file.buffer); 
            
            // ✅ Kyunki tumhari utility abhi seedha secure_url resolve kar rahi hai
            updateData.image = cloudResponse; 
        }

        const item = await Item.findByIdAndUpdate(itemId, updateData, { new: true });

        if (!item) {
            return res.status(404).json({ message: "Item Not Found" });
        }

        const shop = await Shop.findOne({ owner: ownerId }).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(200).json(shop);
    } catch (error) {
        console.error("❌ Edit Item Error:", error);
        return res.status(500).json({ message: `Edit Item Error: ${error.message}` });
    }
};



const getitembyid = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item Not Found" });
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({ message: `Get Item Error: ${error.message}` });
    }
};

const deleteitem = async (req, res) => {
    try {
        const itemId = req.params.id || req.params.itemId;
        const ownerId = req.user?._id || req.userId || req.id;

        const item = await Item.findByIdAndDelete(itemId);
        if (!item) return res.status(404).json({ message: "Item Not Found" });

        const shop = await Shop.findOneAndUpdate(
            { owner: ownerId },
            { $pull: { items: itemId } },
            { new: true }
        ).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `Delete Item Error: ${error.message}` });
    }
};

const getItembycity = async (req, res) => {
    try {
        const city = req.params.city;
        const shops = await Shop.find({ city: { $regex: city, $options: 'i' } });
        
        const shopsIds = shops.map(shop => shop._id);

        // ✅ FIX: Yahan '.populate("shop")' add kiya hai
        const items = await Item.find({ shop: { $in: shopsIds } }).populate("shop"); 
        
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ message: `Get Item by City Error: ${error.message}` });
    }
};
module.exports = { AddItem, EditItem, getitembyid, deleteitem, getItembycity };