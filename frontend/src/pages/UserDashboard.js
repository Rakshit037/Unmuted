import Navbar from "../components/Navbar";
import ComedianList from "../components/ComedianList";
import ShowList from "../components/ShowList";

const UserDashboard = () => {
  return (
    <div>
      <Navbar />
      
      {/* ONLY VIEW MODE */}
      <ComedianList isAdmin={false} />
      <ShowList isAdmin={false} />
    </div>
  );
};

export default UserDashboard;