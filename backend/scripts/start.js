import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");
const envPath = path.join(backendDir, ".env");
const examplePath = path.join(backendDir, ".env");

if (fs.existsSync(envPath)) {
  console.log("backend/.env already exists - leaving it untouched.");
} else {
  fs.copyFileSync(examplePath, envPath);
  console.log("Created backend/.env from .env");
}