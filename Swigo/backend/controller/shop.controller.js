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
        // --- FIX: Buffer ka use karo, path ka nahi ---
        if (req.file) {
            // Tumhare cloudinary utility ko buffer chahiye
            image = await uploadoncloudinary(req.file.buffer); 
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const hasCoords = !isNaN(lat) && !isNaN(lon);

        let shopData = await Shop.findOne({ owner: ownerId });

        if (!shopData) {
            if (!image) return res.status(400).json({ success: false, message: "Image is required" });
            if (!hasCoords) return res.status(400).json({ success: false, message: "Valid coordinates required" });

            shopData = await Shop.create({
                name, city, state, address, image, owner: ownerId,
                location: { type: "Point", coordinates: [lon, lat] }
            });
        } else {
            shopData.name = name || shopData.name;
            shopData.city = city || shopData.city;
            shopData.state = state || shopData.state;
            shopData.address = address || shopData.address;
            
            if (image) shopData.image = image;
            if (hasCoords) {
                shopData.location = { type: "Point", coordinates: [lon, lat] };
            }
            await shopData.save();
        }

        const finalShop = await Shop.findOne({ owner: ownerId }).populate("owner items");
        return res.status(200).json({ success: true, shop: finalShop });

    } catch (error) {
        console.error("🔥 CreateShop Error:", error);
        return res.status(500).json({ success: false, message: error.message });
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