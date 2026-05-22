
const User = require("../models/user/usermodel.js")


// controller/user.controller.js
const getcurruser = async (req ,res) => {
    try {
        const userId = req.userId;
        if(!userId) return res.status(401).json({message : "UserId not found"});

        const user = await User.findById(userId).select("-password");
        if(!user) return res.status(401).json({message : "User not found"});

        // 🚨 CULPRIT: {user} ki jagah sirf user bhejo!
        return res.status(200).json(user); 
    } catch (error) {
        return res.status(500).json({message : "Get current user error"});
    }
}

export const updateUserLocation = async (req, res) => {
    try {
        // Standardizing input from both common formats
        const lat = req.body.lat || req.body.latitude;
        const lon = req.body.lon || req.body.longitude;

        // Checking user session/auth
        const userId = req.user?._id || req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access: User session not found." });
        }

        // Input Validation
        if (lat === undefined || lon === undefined) {
            return res.status(400).json({ success: false, message: "Invalid coordinates provided." });
        }

        // Updating User Location (GeoJSON Point)
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    location: {
                        type: "Point",
                        // Note: GeoJSON order is [longitude, latitude]
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    }
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User record not found." });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Location successfully synchronized.",
            location: user.location 
        });

    } catch (error) {
        console.error("Location Update Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error during location sync.", 
            error: error.message 
        });
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