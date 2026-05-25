const jwt = require("jsonwebtoken");


const generateToken = (userid) => {
    // 1. JWT_SECRET ka check
    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET is not defined!");
        return null;
    }

    try {
        // 2. Token generation
        const token = jwt.sign({ userid }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });
        return token;
    } catch (err) {
        console.error("Token generation error:", err.message);
        return null;
    }
};

module.exports = generateToken;

