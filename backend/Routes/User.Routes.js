import express from "express";
import {
  registerClient,
  loginUser,
  signoutUser,
  changepassword,
  getAllUsers,
} from "../Controller/User.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/register", registerClient);
router.post("/login", loginUser);
router.post("/signout", signoutUser);
router.post("/changePassword", changepassword);//this route is not working right now
router.get("/admin/users", protect, authorize("admin"), getAllUsers );

export default router;
