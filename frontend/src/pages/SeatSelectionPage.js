import { useParams } from "react-router-dom";
import SeatGrid from "../components/SeatGrid";

const SeatSelectionPage = () => {
  const { showId } = useParams();

  return <SeatGrid showId={showId} />;
};

export default SeatSelectionPage;