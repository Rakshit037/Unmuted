import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  title: { type: String, required: true },

  comedian_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comedian",
    required: true
  },

  venue: { type: String, required: true },

  show_date: { type: Date, required: true },
  show_time: { type: String, required: true }, // "19:00"

  description: String,

  image: String,

  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  },

  seat_layout: {
    type: Object, // we’ll define structure later
    default: {}
  }

}, { timestamps: true });

export default mongoose.model("Show", showSchema);