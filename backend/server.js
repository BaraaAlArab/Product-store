import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import products from "./Routes/Product.Routes.js";
import User from "./Routes/User.Routes.js";

import { connectDB } from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); // Accept JSON data

app.use("/api/users", User);
app.use("/api/products", products);

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost:" + PORT);
});
