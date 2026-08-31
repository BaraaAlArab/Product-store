import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing. Create backend/.env first (see README).");
    process.exit(1);
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env");
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