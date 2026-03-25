import express from "express";
import {
  addReview,
  getReviewsByShow,
  getAverageRating
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:showId", getReviewsByShow);
router.get("/:showId/average", getAverageRating);

export default router;