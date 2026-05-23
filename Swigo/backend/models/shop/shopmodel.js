const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"], 
            default: "Point",
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    }],

    averageRating: {
        type: Number,
        default: 0, 
    },
    totalRatings: {
        type: Number,
        default: 0, 
    },

    // 🔥 NEW REAL FIELD: Total Orders Track Karne Ke Liye Add Kiya
    totalOrders: {
        type: Number,
        default: 0, 
    }

}, { timestamps: true });

shopSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Shop || mongoose.model("Shop", shopSchema);