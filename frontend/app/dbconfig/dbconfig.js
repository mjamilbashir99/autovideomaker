import mongoose from "mongoose";
// Load environment variables

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    // process.exit(1); // Exit the process if DB connection fails
  }
};

export default Connection;
