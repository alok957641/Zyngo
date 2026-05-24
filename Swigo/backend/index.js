const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/db.js");

// Import Routes
const authRoute = require("./routes/authroute.js");
const userRoute = require("./routes/userroute.js");
const shopRoute = require("./routes/shoproute.js");
const itemRoute = require("./routes/itemroute.js");
const orderRoute = require("./routes/orderroute.js");
const ratingRoute = require("./routes/rating.js");
const payoutRoute = require("./routes/payoutRoute.js");
const adminRoute = require("./routes/adminRoute.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// 1. CORS Configuration (Fixes Vercel <-> Render CORS)
app.use(cors({
  origin: ["https://zyngo-omega.vercel.app", "http://localhost:5173"], 
  credentials: true, // <--- Ye bohot zaroori hai
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Middlewares
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});
// 3. API Routes (Mounting)
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/shop", (req, res, next) => {
    console.log("Shop Route Hit:", req.url);
    next();
}, shopRoute);
app.use("/api/item", itemRoute);
app.use("/api/order", orderRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/payout", payoutRoute);
app.use("/api/admin", adminRoute);

// 4. Health Check
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is healthy and running! 🔥" });
});

// 5. Database & Server Start
const startServer = async () => {
    try {
        await database();
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port} 🚀`);
        });
    } catch (err) {
        console.error("Server start error:", err);
        process.exit(1); // Exit on failure
    }
};

startServer();

