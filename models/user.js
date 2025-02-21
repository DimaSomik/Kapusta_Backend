import mongoose from "mongoose";
import { transactionSchema } from "./transaction.js";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /.+\@.+\..+/,
        "Please fill a valid email address",
      ] /** walidacja formatu email */,
    },
    passwordHash: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
    },
    originUrl: {
      type: String,
      required: function () {
        return !this.googleId;
      },
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
