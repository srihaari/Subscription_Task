// server/src/seed/adminSeed.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function seedAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("🚀 Admin user created:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
}
