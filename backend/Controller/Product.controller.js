import Product from "../models/Product.model.js";
import mongoose from "mongoose";
export const getProducts = async (req, res) => {
  try {
    const newProduct = await Product.find({});
    res.status(200).json({success: true, data: newProduct});
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({success: false, message: "servererror"});
  }
};
export const createProduct = async (req, res) => {
  const {name, price, image} = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({success: false, message: "Please provide all fields"});
  }

  const newProduct = new Product({name, price, image});

  try {
    await newProduct.save();
    res.status(201).json({success: true, data: newProduct});
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({success: false, message: "Server Error"});
  }
};
export const updateProduct = async (req, res) => {
  const {id} = req.params;
  const products = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({success: false, message: "no product found with that id..."});
  }
  try {
    const UpdatedProduct = await Product.findByIdAndUpdate(id, products, {
      new: true,
    });
    res.status(200).json({success: true, data: UpdatedProduct});
  } catch (error) {
    res.status(500).json({success: false, message: "Server error"});
  }
};
export const deleteProduct = async (req, res) => {
  const {id} = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({success: false, message: "no product found with that id..."});
  }
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({success: true, message: "Product deleted"});
  } catch (error) {
    res.status(500).json({success: false, message: "Server Error..."});
  }
};
