import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";
import products from "./models/Product.model.js";
dotenv.config();

const app = express();

app.use(express.json()); //this allow us  to accept JSON data in the body.

app.post("/api/products", async (req, res) => {
  const products = req.body; // user will send this data
  if (!products.name || !products.price || !products.image) {
    return res
      .status(400)
      .json({success: false, message: "Please provide all fields"});
  }
  const newProduct = new products(products);
  try {
    await newProduct.save();
    res.status(201).json({success: true, data: newProduct});
  } catch (error) {
    console.error("error in created product:", error.message);
    res.status(500).json({success: false, message: "Server Error"});
  }
});
app.delete("/api/products/:id", async (req, res) => {
  const {id} = req.params;
  try {
    await products.findById(id);
    res.status(200).json({success: true, message: "Product deleted"});
  } catch (error) {
    res.status(404).json({success: false, message: "product not found"});
  }
});
app.listen(5000, () => {
  connectDB();
  console.log("server started at http://localhost:5000 ");
});
