const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  poster: {
    type: String
  },

  backgroundImage: {
    type: String
  },

  trailer: {
    type: String
  },

  cast: [
    {
      type: String
    }
  ],

  price: {
  type: Number,
  required: true,
  min: [1, "Price must be greater than 0"]
},
showTimes: {
  type: [String],
  default: ["10:00 AM", "01:30 PM", "05:00 PM", "09:00 PM"]
},
showDates: {
  type: [String],
  default: []
},

  totalSeats: {
    type: Number,
    required: true
  },

  availableSeats: {
    type: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Movie", movieSchema);