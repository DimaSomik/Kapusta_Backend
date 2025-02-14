import mongoose from "mongoose";
const { Schema } = mongoose;


export const transactionSchema = new Schema(
  {
    description: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

export const TransactionModel = mongoose.model("transaction", transactionSchema);
