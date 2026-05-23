
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

const updateUserLocation = async (req, res) => {
    try {
        // 1. Dono format support karega (lat/latitude aur lon/longitude)
        const lat = req.body.lat || req.body.latitude;
        const lon = req.body.lon || req.body.longitude;

        // 2. ID Check (Jo bhi tere auth middleware mein set ho)
        const userId = req.user?._id || req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Bhai, login session nahi mila!" });
        }

        // 3. Validation: Coordinates zero ya missing nahi honi chahiye
        if (lat === undefined || lon === undefined) {
            return res.status(400).json({ success: false, message: "Latitude aur Longitude dono zaroori hain!" });
        }

        // 4. Update Database
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    location: {
                        type: "Point",
                        // 🚨 MongoDB Rules: Hamesha [Longitude, Latitude] ka order hona chahiye
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    }
                }
            },
            { new: true } // Taaki update ke baad naya data return kare
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User nahi mila!" });
        }

        // console.log(`📍 Location Synced for: ${user.fullname}`); // Debugging ke liye sahi hai

        return res.status(200).json({ 
            success: true, 
            message: "Location updated successfully",
            location: user.location 
        });

    } catch (error) {
        console.error("🔥 Update Location Error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Server internal error", 
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