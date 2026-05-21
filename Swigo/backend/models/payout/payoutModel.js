    const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["owner", "deliveryboy"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "rejected"], 
        default: "pending" 
    },
    // Owner apna UPI ya Bank detail daalega request ke time
    paymentMethodInfo: { 
        type: String, 
        required: true 
    },
    processedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("PayoutRequest", payoutSchema);