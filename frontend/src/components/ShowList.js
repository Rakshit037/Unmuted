import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ShowList = () => {
  const [shows, setShows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      const res = await API.get("/shows");
      setShows(res.data);
    };
    fetchShows();
  }, []);

  return (
    <Grid container spacing={3} mt={2}>
      {shows.map((show) => (
        <Grid item xs={12} sm={6} md={4} key={show._id}>
          <Card onClick={() => navigate(`/shows/${show._id}`)}>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:5000/uploads/shows/${show.image}`}
            />

            <CardContent>
              <Typography variant="h6">{show.title}</Typography>
              <Typography>{show.venue}</Typography>
              <Typography>{show.show_date}</Typography>
              <Typography>{show.show_time}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShowList;