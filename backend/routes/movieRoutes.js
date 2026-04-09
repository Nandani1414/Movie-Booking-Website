
const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Booking = require("../models/booking"); // Booking model import karna zaroori hai
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 1. ADD MOVIE (ADMIN ONLY)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      poster,
      backgroundImage,
      trailer,
      cast,
      price,
      totalSeats,
      showTimes,
      showDates
       
    } = req.body;

    const movie = new Movie({
      title,
      description,
      poster,
      backgroundImage,
      trailer,
      cast,
      price,
       totalSeats,
      showTimes,
      showDates,
     availableSeats: totalSeats
    });

    await movie.save();
    res.json({ message: "Movie added successfully", movie });
  } catch (error) {
    res.status(500).json({ message: "Error adding movie" });
  }
});

// 2. GET ALL MOVIES (USER/ADMIN)
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies" });
  }
});

// 3. GET OCCUPIED SEATS FOR A MOVIE (NEW FEATURE)
// Yeh API frontend ko batayega ki kaunsi seats pehle se booked hain
// GET OCCUPIED SEATS FOR A MOVIE BY TIME
router.get("/:id/occupied", async (req, res) => {
  try {
   const { date, time } = req.query;

const query = { movie: req.params.id };

if (date) {
  query.showDate = date;
}

if (time) {
  query.showTime = time;
}

    const bookings = await Booking.find(query);
    let occupiedSeats = [];
    bookings.forEach(b => {
      occupiedSeats = [...occupiedSeats, ...b.seats];
    });
    res.json(occupiedSeats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching occupied seats" });
  }
});

// 4. GET SINGLE MOVIE BY ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie" });
  }
});

// 5. UPDATE MOVIE (ADMIN ONLY)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie updated successfully", movie });
  } catch (error) {
    res.status(500).json({ message: "Error updating movie" });
  }
});

// 6. DELETE MOVIE (ADMIN ONLY)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {

    const movieId = req.params.id;

    // 1️⃣ Delete all bookings related to this movie
    await Booking.deleteMany({ movie: movieId });

    // 2️⃣ Delete the movie
    const movie = await Movie.findByIdAndDelete(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie and related bookings deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting movie" });
  }
});
module.exports = router;