const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/db.js");

// Routes
const router = require("./routes/authroute.js");
const userroute = require("./routes/userroute.js");
const shoprouter = require("./routes/shoproute.js");
const itemrouter = require("./routes/itemroute.js");
const orderrouter = require("./routes/orderroute.js");
const ratingrouter = require("./routes/rating.js");
const payoutRouter = require("./routes/payoutRoute.js");
const adminRoutes = require("./routes/adminRoute.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ FIXED CORS SETUP (Multi-origin support)
const allowedOrigins = [
  "http://localhost:5173", 
  "https://zyngo-omega.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // !origin allowed hai kyunki server-to-server request mein origin nahi hota
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Yeh TRUE hona hi chahiye!
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// 🛣️ API Routes 
app.use("/api/auth", router);
app.use("/api/user", userroute);
app.use("/api/shop", shoprouter);
app.use("/api/item", itemrouter);
app.use("/api/order", orderrouter);
app.use("/api/rating", ratingrouter);
app.use("/api/payout", payoutRouter);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Working 🔥");
});

// 🚀 Server Start
const startServer = async () => {
  try {
    await database();
    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`);
    });
  } catch (err) {
    console.log("Server start error:", err);
  }
};

startServer();

module.exports = app;