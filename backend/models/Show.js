import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comedian_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comedian",
    required: true
  },
  venue: String,
  show_date: Date,
  show_time: String,
  description: String,
  image: String,

  // IMPORTANT (we'll use later)
  seat_layout: {
    type: Object,
    default: {}
  }

}, { timestamps: true });

export default mongoose.model("Show", showSchema);