const jwt = require("jsonwebtoken");

const generateToken = (userid) => {
    try {
        // Spelling mistake fix: tocken -> token
        // JWT_SECRET ka check laga lo taaki agar .env load na ho toh pata chale
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign({ userid }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });
        
        return token;
    } catch (err) {
        console.error("Token generation error:", err.message);
        return null;
    }
}

module.exports = generateToken;