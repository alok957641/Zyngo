const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
    const token = req.cookies?.token; 
    
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // ✅ Yahan "userid" use karo, kyunki generateToken mein tumne yahi key rakhi hai
        return decoded.userid; 
    } catch (err) {
        console.log("JWT Verification Failed:", err.message);
        return null;
    }
};

module.exports = generateToken;