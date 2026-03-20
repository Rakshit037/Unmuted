import express from "express";
import {
  createComedian,
  getComedians,
  getComedianById,
  updateComedian,
  deleteComedian
} from "../controllers/comedianController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Admin only
router.post("/", protect, authorizeRoles("admin"), upload.single("image"), createComedian);
router.put("/:id", protect, authorizeRoles("admin"), upload.single("image"), updateComedian);
router.delete("/:id", protect, authorizeRoles("admin"), deleteComedian);

// Public
router.get("/", getComedians);
router.get("/:id", getComedianById);

export default router;