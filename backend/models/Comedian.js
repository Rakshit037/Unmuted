import mongoose from "mongoose";

const comedianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  bio: String,
  image: String,
  experience: String, // "5+ years"
  gender: String
}, { timestamps: true });

export default mongoose.model("Comedian", comedianSchema);