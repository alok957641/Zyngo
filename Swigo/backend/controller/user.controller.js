const User = require("../models/user/usermodel.js");

// Get Current User
const getcurruser = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized: UserId not found" });

        const user = await User.findById(userId).select("-password").lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Current User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update User Location
const updateUserLocation = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized access" });

        const lat = parseFloat(req.body.lat || req.body.latitude);
        const lon = parseFloat(req.body.lon || req.body.longitude);

        // Validation
        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ success: false, message: "Invalid coordinates provided" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    location: {
                        type: "Point",
                        // GeoJSON format: [longitude, latitude]
                        coordinates: [lon, lat]
                    }
                }
            },
            { new: true, select: "location" }
        );

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            location: user.location
        });
    } catch (error) {
        console.error("Update Location Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update location" });
    }
};

// Toggle Availability Status
const toggleAvailabilityStatus = async (req, res) => {
    try {
        const userId = req.userId || req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: "Session expired" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.isOnline = !user.isOnline;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Status switched to ${user.isOnline ? 'ONLINE' : 'OFFLINE'}`,
            isOnline: user.isOnline
        });
    } catch (error) {
        console.error("Toggle Status Error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};

module.exports = { getcurruser, updateUserLocation, toggleAvailabilityStatus };