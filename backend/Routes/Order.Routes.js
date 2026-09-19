import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
} from "../Controller/Order.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public: track by tracking number (no auth needed to look up)
router.get("/track/:trackingNumber", trackOrder);

// Admin Only (keep above "/:id" so "admin" doesn't match the id param)
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.put("/admin/:id/status", protect, authorize("admin"), updateOrderStatus);

// Authenticated
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;