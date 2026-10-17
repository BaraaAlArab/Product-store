import { Router } from "express";
import {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} from "../Controller/Message.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = Router();

// Public — anyone can send a contact message (rate-limited to deter spam)
router.post("/", authLimiter, createMessage);

// Admin only
router.get("/admin/messages", protect, authorize("admin"), getMessages);
router.patch("/admin/messages/:id", protect, authorize("admin"), toggleMessageRead);
router.delete("/admin/messages/:id", protect, authorize("admin"), deleteMessage);

export default router;
