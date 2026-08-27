import express from "express";
import {
  registerClient,
  loginUser,
  signoutUser,
  changepassword,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../Controller/User.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/register", registerClient);
router.post("/login", loginUser);
router.post("/signout", signoutUser);

// Authenticated
router.get("/me", protect, getMe);
router.post("/changePassword", protect, changepassword);

// Admin Only
router.get("/admin/users", protect, authorize("admin"), getAllUsers);
router.put("/admin/users/:id", protect, authorize("admin"), updateUser);
router.delete("/admin/users/:id", protect, authorize("admin"), deleteUser);

export default router;
