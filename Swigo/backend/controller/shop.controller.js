const uploadoncloudinary = require("../utils/cloudinary.js");
const Shop = require("../models/shop/shopmodel.js");
const Order = require("../models/order/ordermodel.js"); 

const CreateAndEditShop = async (req, res) => {
      console.log("🔥 CreateAndEditShop called");  // ✅ Debug line
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("ownerId:", req.user?._id);
    try {
        const { name, city, state, address, latitude, longitude } = req.body;
        const ownerId = req.user?._id || req.userId || req.id;

        if (!ownerId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let image;
        if (req.file) {
            const cloudResponse = await uploadoncloudinary(req.file.path);
            image = typeof cloudResponse === "string" ? cloudResponse : cloudResponse?.secure_url;
        }

        let shopData = await Shop.findOne({ owner: ownerId });

        const locationData = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };

        if (!shopData) {
            if (!image) return res.status(400).json({ message: "Image is required" });
            if (!latitude || !longitude) return res.status(400).json({ message: "Location coordinates required!" });

            shopData = await Shop.create({
                name, city, state, address, image, owner: ownerId,
                location: locationData 
            });
        } else {
            const updateData = { name, city, state, address };
            if (image) updateData.image = image;
            if (latitude && longitude) updateData.location = locationData;
            shopData = await Shop.findByIdAndUpdate(shopData._id, updateData, { new: true });
        }

        const finalShop = await Shop.findOne({ owner: ownerId }).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(201).json(finalShop);

    } catch (error) {
        console.error("🔥 CreateShop Error:", error.message);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
}

const getMyShop = async (req, res) => {
    try {
        const ownerId = req.user?._id || req.userId || req.id;

        if (!ownerId) {
            return res.status(401).json({ message: "ID missing in request" });
        }

        const shop = await Shop.findOne({ owner: ownerId }).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        if (!shop) {
            return res.status(404).json({ message: "Shop not found", success: false });
        }

        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `getMyshop Error: ${error.message}` });
    }
}

const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const cleanCity = city ? city.trim() : "";

        if (!cleanCity) {
            return res.status(400).json({ message: "City name is required" });
        }

        const shops = await Shop.find({ 
            city: { $regex: cleanCity, $options: 'i' } 
        }).populate('owner').populate('items');

        if (!shops || shops.length === 0) {
            return res.status(200).json([]);  // ✅ Empty array return karo, 404 nahi
        }

        // ✅ Sahi field name "shop" hai (from your order model)
        const shopsWithRealOrders = await Promise.all(
            shops.map(async (shop) => {
                try {
                    const actualCount = await Order.countDocuments({ shop: shop._id });
                    const shopObj = shop.toObject();
                    shopObj.totalOrders = actualCount || 0;
                    return shopObj;
                } catch (err) {
                    const shopObj = shop.toObject();
                    shopObj.totalOrders = 0;
                    return shopObj;
                }
            })
        );

        return res.status(200).json(shopsWithRealOrders);
    } catch (error) {
        console.error("getShopByCity Error:", error);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
}

module.exports = { CreateAndEditShop, getMyShop, getShopByCity };