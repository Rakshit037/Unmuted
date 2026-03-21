import express from "express";
import {
  createShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow
} from "../controllers/showController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import createUploader from "../config/multer.js";

const router = express.Router();

const upload = createUploader("shows");

// Admin
router.post("/", protect, authorizeRoles("admin"), upload.single("image"), createShow);
router.put("/:id", protect, authorizeRoles("admin"), upload.single("image"), updateShow);
router.delete("/:id", protect, authorizeRoles("admin"), deleteShow);

// Public
router.get("/", getShows);
router.get("/:id", getShowById);

export default router;