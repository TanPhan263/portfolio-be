import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("Failed to connect mongodb", err);
    process.exit(1);
  }
};

export default connectDB;
