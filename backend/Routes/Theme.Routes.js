import express from "express";
import { getTheme, setTheme } from "../Controller/Theme.controller.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

// Public: the active event theme (applied to every visitor)
router.get("/", getTheme);

// Admin only: change the site-wide theme
router.put("/", protect, authorize("admin"), setTheme);

export default router;