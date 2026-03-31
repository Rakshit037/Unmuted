
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SeatSelectionPage from './pages/SeatSelectionPage';
import BookingHistory from './pages/BookingHistory';
import ShowDetails from './pages/ShowDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/show/:showId" element={<SeatSelectionPage />} />
        <Route path="/shows/:showId" element={<ShowDetails />} />
        <Route path="/bookings" element={<BookingHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
