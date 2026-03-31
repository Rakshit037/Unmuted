import express from "express";
import { createBooking, cancelBooking, getMyBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyBookings);

router.post("/", protect, createBooking);
router.put("/:id/cancel", protect, cancelBooking);

export default router;