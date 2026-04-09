

const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Movie = require("../models/movie");
const { verifyToken } = require("../middleware/authMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 1. BOOK TICKET (Updated with showTime)
router.post("/book", verifyToken, async (req, res) => {
  try {
    // 1. Destructure all fields from req.body
    const { movieId, seats, showDate , showTime, userUpiId, transactionId } = req.body;
    const existingBookings = await Booking.find({
  movie: movieId,
  showTime,
  showDate
});

const bookedSeats = existingBookings.flatMap(b => b.seats);

const conflict = seats.some(seat => bookedSeats.includes(seat));

if (conflict) {
  return res.status(400).json({
    message: "Some seats are already booked by another user."
  });
}

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 2. Seat availability check
    if (movie.availableSeats < seats.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalPrice = seats.length * movie.price;

    // 3. Save everything in Booking model
    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      seats,
      showDate,
       showTime, 
      totalPrice : totalPrice || (seats.length * movie.price),
          // Timing save karne ke liye
      userUpiId,     // User ki UPI ID save karne ke 
      transactionId ,
      paymentStatus: "Completed"
       // 12-digit UTR save karne ke liye
    });

    await booking.save();

    // 4. Update movie seats
    movie.availableSeats -= seats.length;
    await movie.save();

    res.json({
      message: "Ticket booked successfully",
      booking
    });

  } catch (error) {
    console.log("Backend Error:", error); // Terminal mein error check karein
    res.status(500).json({
      message: "Error booking ticket",
      error: error.message
    });
  }
});

// 2. GET USER BOOKINGS (Updated with User Name & Movie details)
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("movie")
      .populate("user", "name email"); 

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// 3. ADMIN - GET ALL BOOKINGS
router.get("/all", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("movie")
      .populate("user");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings"
    });
  }
});

// --- NEW: PROCESS PAYMENT ROUTE ---
router.post("/process-payment", verifyToken, async (req, res) => {
  try {
    const { amount, tokenId, movieId, seats, showTime } = req.body;
    const movie = await Movie.findById(movieId);
if (!movie) {
  return res.status(404).json({ message: "Movie not found" });
}

if (movie.availableSeats < seats.length) {
  return res.status(400).json({ message: "Not enough seats available" });
}

    // 1. Stripe Charge Create karna
    const charge = await stripe.charges.create({
      amount: amount * 100, // INR to Paise (Stripe paise mein leta hai)
      currency: "inr",
      source: tokenId,
      description: `Movie Booking: ${movieId}`,
    });

    if (charge.status === "succeeded") {
      // 2. Agar payment success ho jaye, tabhi Booking save hogi
      const booking = new Booking({
        user: req.user.id,
        movie: movieId,
        seats,
        totalPrice: seats.length * movie.price,
        showTime,
        paymentStatus: "Completed" // Status change ho gaya
      });

      await booking.save();

      // 3. Seats kam karna
      
      movie.availableSeats -= seats.length;
      await movie.save();

      res.json({ success: true, message: "Payment & Booking Successful", booking });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Payment Failed" });
  }
});

// DELETE A BOOKING
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Security check: Sirf wahi user delete kar sake jisne book kiya hai
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});
module.exports = router;