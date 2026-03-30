import Review from "../models/Review.js";
import Booking from "../models/Booking.js";


// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { show_id, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if user booked this show
    const booking = await Booking.findOne({
      user_id: userId,
      show_id,
      status: "booked"
    });

    if (!booking) {
      return res.status(403).json({
        message: "You can only review after booking"
      });
    }

     if (!show_id || !rating || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingReview = await Review.findOne({
      show_id,
      user_id: userId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this show"
      });
    }

    const review = await Review.create({
      user_id: userId,
      show_id,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET REVIEWS FOR SHOW
export const getReviewsByShow = async (req, res) => {
  try {
    const reviews = await Review.find({
      show_id: req.params.showId
    }).populate("user_id", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET AVERAGE RATING
export const getAverageRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      {
        $match: { show_id: new mongoose.Types.ObjectId(req.params.showId) }
      },
      {
        $group: {
          _id: "$show_id",
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    res.json(result[0] || { avgRating: 0 });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};