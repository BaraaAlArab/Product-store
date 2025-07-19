import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import products from "./Routes/Product.Routes.js";
import User from "./Routes/User.Routes.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); // Accept JSON data
app.use("/api/users", User);

app.use("/api/products", products);

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost: " + PORT);
});
