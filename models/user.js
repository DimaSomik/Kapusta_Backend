import mongoose from "mongoose";
import { transactionSchema } from "./transaction.js";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    originUrl: {
      type: String,
      required: [true, "Origin is required"],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
    },
    transactions: [transactionSchema],
  },
  { versionKey: false, timestamps: true }
);

export const UserModel = mongoose.model("user", userSchema);
