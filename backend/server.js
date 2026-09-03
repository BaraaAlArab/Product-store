import "./config/env.js";
import express from "express";
import products from "./Routes/Product.Routes.js";
import User from "./Routes/User.Routes.js";

import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); // Accept JSON data

app.use("/api/users", User);
app.use("/api/products", products);

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
