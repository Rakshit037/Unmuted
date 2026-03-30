import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { Box, Typography, TextField, Button } from "@mui/material";

const ReviewSection = ({ showId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const fetchReviews = useCallback(async () => {
  const res = await API.get(`/reviews/${showId}`);
  setReviews(res.data);
}, [showId]);

  useEffect(() => {
  fetchReviews();
}, [fetchReviews]);

 const handleSubmit = async () => {
  try {
    await API.post("/reviews", {
      show_id: showId,
      rating,
      comment
    });

    setComment("");
    fetchReviews();

  } catch (error) {
    console.log(error.response?.data?.message);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  return (
    <Box mt={4}>
      <Typography variant="h6">Reviews</Typography>

      <TextField
        fullWidth
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mt: 2 }}
      />

      <TextField
        type="number"
        label="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Button onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Review
      </Button>

      {reviews.map((r) => (
        <Box key={r._id} mt={2}>
          <Typography>{r.comment}</Typography>
          <Typography>⭐ {r.rating}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ReviewSection;