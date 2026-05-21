const mongoose = require("mongoose");

const shopOrderItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    image: { type: String }
}, { timestamps: true });

const shopOrderSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subtotal: { type: Number }, // Food total (Item Price * Qty)
    items: [shopOrderItemSchema],
    distance: { type: Number, default: 0 }, // KM me save hoga
    deliveryCharge: { type: Number, default: 0 }, // Distance * 10
    commissionAmount: { type: Number, default: 0 }, // subtotal * 20%
    packagingFee: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "preparing", "out for delivery", "delivered"],
        default: "pending",
    },
    assignedDeliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deliveryOtp: { type: String },
    otpExpires: { type: Date },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    delevryAddress: {
        text: { type: String, required: true },
        longitude: { type: Number },
        latitude: { type: Number }
    },

    // 💰 MASTER BILL (No GST)
    itemTotal: { type: Number },
    totalDeliveryFee: { type: Number },
    totalPackagingFee: { type: Number },
    platformFee: { type: Number, default: 7 }, // 🔥 Updated to ₹7
    tip: { type: Number, default: 0 },
    totalAmount: { type: Number },

    shopOrders: [shopOrderSchema],
    payment: { type: Boolean, default: false },

    razorpayOrderId: { type: String, default: "" },
    isRated: { type: Boolean, default: false },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);