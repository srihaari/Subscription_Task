import mongoose from "mongoose";
import dotenv from "dotenv";
import Plan from "../models/Plan.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const plans = [
  {
    name: "Starter",
    price: 499,
    features: ["Basic analytics", "Email support"],
    duration: 30,
  },
  {
    name: "Pro",
    price: 999,
    features: ["Advanced analytics", "Priority support", "Custom reports"],
    duration: 30,
  },
  {
    name: "Enterprise",
    price: 2999,
    features: ["All features", "Dedicated manager", "SLA"],
    duration: 90,
  },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Plan.deleteMany({});
    await Plan.insertMany(plans);
    console.log("Plans seeded");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
