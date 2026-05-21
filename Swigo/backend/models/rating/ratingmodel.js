const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);