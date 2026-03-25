import express from "express";
import { bookSeats } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookSeats);

export default router;