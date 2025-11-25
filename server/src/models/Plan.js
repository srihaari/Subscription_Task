import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    duration: { type: Number, required: true }, // in days
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
