import Product from "../models/Product.model.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
  try {
    const {search, category, limit = 50} = req.query;
    const filter = {};

    if (search) {
      filter.name = {$regex: search, $options: "i"};
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({createdAt: -1}).limit(Number(limit));
    res.status(200).json({success: true, data: products});
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({success: false, message: "servererror"});
  }
};
export const createProduct = async (req, res) => {
  const {name, price, image, description, category, stock, oldPrice, onSale} = req.body;

  if (!name || price === undefined || !image) {
    return res
      .status(400)
      .json({success: false, message: "Please provide name, price and image"});
  }
  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({success: false, message: "Price must be a non-negative number"});
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return res
      .status(400)
      .json({success: false, message: "Stock must be a non-negative number"});
  }
  if (oldPrice !== undefined && (typeof oldPrice !== "number" || oldPrice < 0)) {
    return res
      .status(400)
      .json({success: false, message: "Old price must be a non-negative number"});
  }

  const newProduct = new Product({name, price, image, description, category, stock, oldPrice, onSale});

  try {
    await newProduct.save();
    res.status(201).json({success: true, data: newProduct});
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({success: false, message: error.message});
    }
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
  if (products.price !== undefined && (typeof products.price !== "number" || products.price < 0)) {
    return res
      .status(400)
      .json({success: false, message: "Price must be a non-negative number"});
  }
  if (products.stock !== undefined && (typeof products.stock !== "number" || products.stock < 0)) {
    return res
      .status(400)
      .json({success: false, message: "Stock must be a non-negative number"});
  }
  if (products.oldPrice !== undefined && (typeof products.oldPrice !== "number" || products.oldPrice < 0)) {
    return res
      .status(400)
      .json({success: false, message: "Old price must be a non-negative number"});
  }
  try {
    const UpdatedProduct = await Product.findByIdAndUpdate(id, products, {
      new: true,
      runValidators: true,
    });
    if (!UpdatedProduct) {
      return res
        .status(404)
        .json({success: false, message: "no product found with that id..."});
    }
    res.status(200).json({success: true, data: UpdatedProduct});
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({success: false, message: error.message});
    }
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
