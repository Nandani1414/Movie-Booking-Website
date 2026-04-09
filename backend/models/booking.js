const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },

  seats: {
    type: [String],   // example: ["A1","A2","A3"]
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },
  // --- NEW FIELDS FOR ADMIN VERIFICATION ---
  transactionId: {
    type: String,     // 12-digit UTR Number
    required: true
  },
  userUpiId: {
    type: String,     // User ki apni UPI ID (nandani@ok...)
    required: true
  },
  // -----------------------------------------

  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },

  bookingDate: {
    type: Date,
    default: Date.now
  } ,
  showTime: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model("Booking", bookingSchema);