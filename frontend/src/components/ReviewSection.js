import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import {
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import toast from "react-hot-toast";

const ReviewSection = ({ showId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    const res = await API.get(`/reviews/${showId}`);
    setReviews(res.data);
  }, [showId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await API.post("/reviews", {
        show_id: showId,
        rating,
        comment
      });

      toast.success("Review added ⭐");
      setComment("");
      setRating(5);
      fetchReviews();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Reviews
      </Typography>

      <TextField
        fullWidth
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <TextField
        type="number"
        label="Rating (1-5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>

      {reviews.length === 0 ? (
        <Typography mt={2}>No reviews yet</Typography>
      ) : (
        reviews.map((r) => (
          <Box
            key={r._id}
            mt={2}
            p={2}
            sx={{
              borderRadius: 2,
              background: "#f5f5f5"
            }}
          >
            <Typography>{r.comment}</Typography>
            <Typography>⭐ {r.rating}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReviewSection;