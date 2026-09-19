import "./config/env.js";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import express from "express";
import products from "./Routes/Product.Routes.js";
import User from "./Routes/User.Routes.js";
import orders from "./Routes/Order.Routes.js";

import { connectDB } from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Behind a proxy (Render), so req.ip is the real client
}

app.use(cors());
app.use(express.json()); // Accept JSON data

// Prevent browser caching of API responses (avoids stale 304 responses)
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/users", User);
app.use("/api/products", products);
app.use("/api/orders", orders);

// In production, serve the built React frontend from the same server
const frontendDist = path.resolve(__dirname, "..", "frontend", "dist");
if (process.env.NODE_ENV === "production" && existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost:" + PORT);
});
