import express from "express";
import { createBooking, cancelBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.put("/:id/cancel", protect, cancelBooking);

export default router;