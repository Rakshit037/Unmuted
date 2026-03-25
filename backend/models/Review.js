import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  comment: String

}, { timestamps: true });


// Prevent duplicate review
reviewSchema.index({ user_id: 1, show_id: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);