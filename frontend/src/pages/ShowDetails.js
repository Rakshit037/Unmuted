import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import ReviewSection from "../components/ReviewSection";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ShowDetails = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchShow = async () => {
    const res = await API.get(`/shows/${showId}`);
    setShow(res.data);
  };

  fetchShow();
}, [showId]);

  if (!show) return <p>Loading...</p>;

  return (
    <Box p={3}>
      <img
        src={`http://localhost:5000/uploads/shows/${show.image}`}
        width="500px"
        height="500px"
        alt=""
      />

      <Typography variant="h4">{show.title}</Typography>
      <Typography>{show.venue}</Typography>

      <Button
        variant="contained"
        onClick={() => navigate(`/show/${show._id}`)}
      >
        Book Seats
      </Button>

      <ReviewSection showId={showId} />
    </Box>
  );
};

export default ShowDetails;