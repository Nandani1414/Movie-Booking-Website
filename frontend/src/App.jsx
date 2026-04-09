import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
// import Footer from "./components/Footer";
import SeatSelection from "./pages/SeatSelection";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/movie/:id" element={<MovieDetails />} />
        {/* Seat Selection aur Payment Page */}
        <Route path="/book-seats/:id" element={<SeatSelection />} />

        <Route path="/login" element={<Login />} />
        {/* 2. YE LINE ADD KAREIN: Forgot Password ka path define karne ke liye */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

    </Router>
  );
}

export default App;