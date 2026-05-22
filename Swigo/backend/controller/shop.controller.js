const uploadoncloudinary = require("../utils/cloudinary.js");
const Shop = require("../models/shop/shopmodel.js");



const Order = require("../models/order/ordermodel.js"); 

const CreateAndEditShop = async (req, res) => {
    try {
        const { name, city, state, address, latitude, longitude } = req.body;
        const ownerId = req.user?._id || req.userId || req.id;

        if (!ownerId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        let image;
        if (req.file) {
            const cloudResponse = await uploadoncloudinary(req.file.path);
            image = typeof cloudResponse === "string" ? cloudResponse : cloudResponse?.secure_url;
        }

        let shopData = await Shop.findOne({ owner: ownerId });

        // Coordinates ko safely parse karo
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const locationData = {
            type: "Point",
            coordinates: [lon, lat] // MongoDB GeoJSON: [longitude, latitude]
        };

        if (!shopData) {
            // New Shop Creation
            if (!image) return res.status(400).json({ success: false, message: "Image is required for new shop" });
            if (isNaN(lat) || isNaN(lon)) return res.status(400).json({ success: false, message: "Valid coordinates required" });

            shopData = await Shop.create({
                name, city, state, address, image, owner: ownerId,
                location: locationData 
            });
        } else {
            // Update Existing Shop
            const updateData = { name, city, state, address };
            if (image) updateData.image = image;
            if (!isNaN(lat) && !isNaN(lon)) {
                updateData.location = locationData;
            }

            await Shop.findByIdAndUpdate(shopData._id, { $set: updateData }, { new: true });
        }

        // Final Fetch with Populate
        const finalShop = await Shop.findOne({ owner: ownerId }).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        return res.status(200).json({ success: true, shop: finalShop });

    } catch (error) {
        console.error("🔥 CreateShop Error:", error.message);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
}

const getMyShop = async (req, res) => {
    try {
        const ownerId = req.user?._id || req.userId || req.id;

        if (!ownerId) {
            return res.status(401).json({ message: "ID missing in request", success: false });
        }

        const shop = await Shop.findOne({ owner: ownerId }).populate([
            { path: "owner" },
            { path: "items", options: { sort: { updatedAt: -1 } } }
        ]);

        // Yahan 404 mat bhejo agar shop nahi mili, 200 bhejo aur shop: null
        if (!shop) {
            return res.status(200).json({ success: true, shop: null, message: "Shop not created yet" });
        }

        return res.status(200).json({ success: true, shop });
    } catch (error) {
        return res.status(500).json({ message: `getMyshop Error: ${error.message}`, success: false });
    }
}


const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const cleanCity = city ? city.trim() : "";

        const shops = await Shop.find({ city: { $regex: cleanCity, $options: 'i' } })
            .populate('owner')
            .populate('items');

        // 🔥 FIX: 404 error ke bajaye 200 OK aur khali array bhejo
        if (!shops || shops.length === 0) {
            return res.status(200).json([]); 
        }

        const shopsWithRealOrders = await Promise.all(
            shops.map(async (shop) => {
                const actualCount = await Order.countDocuments({ shop: shop._id });
                const shopObj = shop.toObject();
                shopObj.totalOrders = actualCount;
                return shopObj;
            })
        );

        return res.status(200).json(shopsWithRealOrders);
    } catch (error) {
        return res.status(500).json({ message: `getShopByCity Error: ${error.message}` });
    }
}

module.exports = { CreateAndEditShop, getMyShop, getShopByCity };