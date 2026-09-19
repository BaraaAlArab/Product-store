import mongoose from "mongoose";
import crypto from "crypto";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

const generateTrackingNumber = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, shipping } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product" });
    }
    if (!shipping?.name || !shipping?.address || !shipping?.city || !shipping?.phone) {
      return res.status(400).json({ message: "Please provide full shipping details" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} in stock` });
    }

    const price = product.price;
    const order = new Order({
      user: req.user.id,
      items: [
        {
          product: product._id,
          name: product.name,
          price,
          quantity,
          image: product.image,
        },
      ],
      total: price * quantity,
      shipping,
      trackingNumber: generateTrackingNumber(),
    });

    await order.save();

    // reduce stock atomically
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // only owner or admin
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    if (!trackingNumber) {
      return res.status(400).json({ message: "Tracking number is required" });
    }
    const order = await Order.findOne({ trackingNumber: trackingNumber.toUpperCase() });
    if (!order) {
      return res.status(404).json({ message: "No order found with that tracking number" });
    }
    if (req.user && order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};