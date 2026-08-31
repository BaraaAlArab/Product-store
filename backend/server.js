import "./config/env.js";
import express from "express";
import products from "./Routes/Product.Routes.js";
import User from "./Routes/User.Routes.js";

import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); // Accept JSON data

// Prevent browser caching of API responses (avoids stale 304 responses)
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/users", User);
app.use("/api/products", products);

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost:" + PORT);
});
