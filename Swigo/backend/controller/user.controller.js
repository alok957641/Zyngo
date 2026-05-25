const User = require("../models/user/usermodel.js");
const jwt = require("jsonwebtoken"); // ✅ Add this

// Helper function to extract userId from token
const getUserIdFromToken = (req) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return null;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId || decoded._id || decoded.id;
    } catch (error) {
        return null;
    }
};

// Get Current User
const getcurruser = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req); // ✅ Use helper function
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No valid token" });
        }

        const user = await User.findById(userId).select("-password").lean();
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Current User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// backend/controller/user.controller.js
 const updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body; // Yahan match karo
        const userId = req.userId; // Middleware se aana chahiye
        
        if (!latitude || !longitude) return res.status(400).json({ message: "Invalid data" });

        const user = await User.findByIdAndUpdate(userId, {
            location: { type: "Point", coordinates: [longitude, latitude] }
        });
        
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



// Toggle Availability Status
const toggleAvailabilityStatus = async (req, res) => {
    try {
        // 🔥 DEBUG: Log cookies to see what the server is receiving
        console.log("Cookies received:", req.cookies); 

        const userId = getUserIdFromToken(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Session expired or no token" });
        }

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