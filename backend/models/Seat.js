import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },

  seat_no: { type: String, required: true }, // A1, B12

  row: String,   // A, B, C
  number: Number,

  level: {
    type: String,
    enum: ["Platinum", "Gold", "Executive", "Royal"]
  },

  price: Number,

  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available"
  },

  lockedUntil: Date // for 5 min lock

}, { timestamps: true });


// 🔥 Prevent duplicate seats per show
seatSchema.index({ show_id: 1, seat_no: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);