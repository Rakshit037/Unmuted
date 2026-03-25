import express from "express";
import { getSeatsByShow, lockSeats } from "../controllers/seatController.js";

const router = express.Router();

router.get("/:showId", getSeatsByShow);
router.post("/lock", lockSeats);

export default router;