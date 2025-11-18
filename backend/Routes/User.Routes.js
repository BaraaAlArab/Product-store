import {
  registerClient,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  changeUserPassword,
} from "../Controller/User.controller.js";

import express from "express";
const router = express.Router();
router.post("/register",registerClient);
router.post("/login",loginUser );
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);
router.put("/change-password", changeUserPassword);

export default router;
