import mongoose from "mongoose";
const { Schema } = mongoose;

const blacklistSchema = new Schema({
  token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});

export const BlacklistModel = mongoose.model("blacklist", blacklistSchema);