import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import products from "./Routes/Product.Routes.js";

dotenv.config();

const app = express();
app.use(express.json()); // Accept JSON data

app.use("/api/products", products);
app.listen(5000, () => {
  connectDB();
  console.log("server started at http://localhost:5000 ");
});
