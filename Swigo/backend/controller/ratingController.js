const Rating = require("../models/rating/ratingmodel");
const Shop = require("../models/shop/shopmodel");
const Order = require("../models/order/ordermodel"); 

const addRating = async (req, res) => {
    try {
        const { orderId, shopId, rating, review } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        // 1. Check if already rated
        const existingRating = await Rating.findOne({ order: orderId, user: userId });
        if (existingRating) {
            return res.status(400).json({ success: false, message: "Already rated!" });
        }

        // 2. Save Rating in Ratings Collection
        await Rating.create({ 
            user: userId, 
            order: orderId, 
            shop: shopId, 
            rating: Number(rating), 
            review: review || "" 
        });

        // 3. 🚀 PERSISTENCE: Update the Order Model
        // This makes sure the rating stays after refresh
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { isRated: true, rating: Number(rating) },
            { new: true }
        );

        if (!updatedOrder) {
            console.error("Order not found with ID:", orderId);
            // If the order update fails, it means the ID is wrong or Model is wrong
        }

        // 4. Update Shop Average
        const allRatings = await Rating.find({ shop: shopId });
        const totalRatingSum = allRatings.reduce((sum, r) => sum + r.rating, 0);
        const avg = (totalRatingSum / allRatings.length).toFixed(1);
        
        await Shop.findByIdAndUpdate(shopId, {
            averageRating: Number(avg),
            totalRatings: allRatings.length
        });

        res.status(201).json({ success: true, message: "Rating submitted successfully!" });

    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addRating };