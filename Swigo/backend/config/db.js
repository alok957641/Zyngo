const mongoose = require("mongoose");
const User = require("../models/user/usermodel"); 

const database = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB Connected! 🚀");

    await User.syncIndexes(); 
    console.log("Indexes Synced Successfully! ✅");

  } catch (err) {
    console.log("DB ERROR ❌:", err.message);
  
    if (err.message.includes("Index build failed")) {
        console.log("💡 Tip: Compass mein jaakar users collection clean karo ya manually index banao.");
    }

    process.exit(1); 
  }
};

module.exports = database;