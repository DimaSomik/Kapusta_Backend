import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

console.log("DB_HOST:", process.env.MONGODB_URL);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
