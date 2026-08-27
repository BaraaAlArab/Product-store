import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ADMIN_NAME = process.argv[2] || "admin";
const ADMIN_EMAIL = process.argv[3] || "admin@example.com";
const ADMIN_PASSWORD = process.argv[4] || "Admin1234!";

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Create backend/.env first (see README).");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists at ${ADMIN_EMAIL}. Skipping.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    telephone: "00000000",
    role: "admin",
  });

  console.log(`Admin created -> email: ${ADMIN_EMAIL}, password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});