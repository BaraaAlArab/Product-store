import express from "express";
import {
  registerClient,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
} from "../Controller/User.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Register a client (public)
router.post("/register", registerClient);

// Login (public)
router.post("/login", loginUser);

// Profile routes (protected: client/admin)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUser);

// Admin Only: get all users
router.get("/all-users", protect, authorize("admin"), getAllUsers);

export default router;
