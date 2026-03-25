import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },

  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat"
    }
  ],

  total_price: Number,

  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);