
const User = require("../models/user/usermodel.js")


// controller/user.controller.js
const getcurruser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: "UserId not found" });

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });

        // 🚨 CULPRIT: {user} ki jagah sirf user bhejo!
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Get current user error" });
    }
}

const updateUserLocation = async (req, res) => {
    try {
        const { address, lat, latitude, lon, longitude } = req.body;
        const latitudeVal = lat || latitude;
        const longitudeVal = lon || longitude;

        const userId = req.user?._id || req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        // 1. Validation: Agar address bhi nahi aur coords bhi nahi, toh reject karo
        if (!address && (latitudeVal === undefined || longitudeVal === undefined)) {
            return res.status(400).json({ success: false, message: "Address ya Coordinates mein se kuch toh bhejo!" });
        }

        // 2. Prepare Update Data
        let updateFields = {};
        
        // Agar address aaya hai toh update karo
        if (address) {
            updateFields.deliveryAddress = address; 
        }

        // Agar coordinates aaye hain toh GeoJSON update karo
        if (latitudeVal !== undefined && longitudeVal !== undefined) {
            updateFields.location = {
                type: "Point",
                coordinates: [parseFloat(longitudeVal), parseFloat(latitudeVal)]
            };
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        return res.status(200).json({ 
            success: true, 
            message: "Location/Address synced successfully.",
            user 
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 🚀 GLOBAL AVAILABILITY TOGGLE CONTROLLER
const toggleAvailabilityStatus = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId || req.id;
        if (!userId) return res.status(401).json({ success: false, message: "Session expired!" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User profile mismatch!" });

        // 🔥 Matrix invert state operation
        user.isOnline = !user.isOnline;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Status switched to ${user.isOnline ? 'ONLINE' : 'OFFLINE'}`,
            isOnline: user.isOnline
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { getcurruser, updateUserLocation, toggleAvailabilityStatus }