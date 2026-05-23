const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        mobile: {
            type:String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "owner", "deliveryboy", "admin"],
            required: true,
        },


        isOnline: {
            type: Boolean,
            default: true,
        },

        resetOtp: {
            type: String,
        },
        isOtpVerified: {
            type: Boolean,
            default: false,
        },
        otpExpiry: {
            type: Date,
        },
        location: {
            type: { type: String, default: "Point" },
            coordinates: { type: [Number], index: "2dsphere" } // Index zaroori hai location queries ke liye
        },
        wallet: {
            type: Number,
            default: 0,
        },
        cashInHand: {
            type: Number,
            default: 0
        },
        lifetimeEarnings: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);