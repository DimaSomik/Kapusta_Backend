import mongoose from "mongoose";
const { Schema } = mongoose;

const sessionSchema = new Schema({
    uid: mongoose.Types.ObjectId,
});

export const SessionModel = mongoose.model("session", sessionSchema);
