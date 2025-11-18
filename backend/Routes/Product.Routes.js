import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Controller/Product.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public Route - anyone (client/admin) can view products
router.get("/", getProducts);

// Admin Only Routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
