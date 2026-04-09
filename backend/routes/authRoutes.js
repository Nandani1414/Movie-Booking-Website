const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const Booking = require("../models/booking");

const router = express.Router();

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});
// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});
// TEST ADMIN ROUTE
router.get("/admin-test", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! You have access." });
});

// GET ALL USERS (ADMIN ONLY)
router.get("/all-users", verifyToken, isAdmin, async (req, res) => {
  try {
    // Sabhi users fetch karein par password nahi dikhana (security ke liye)
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// DELETE USER (ADMIN ONLY)
router.delete("/delete-user/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 1. Check: Admin khud ko delete na kare
    if (userToDelete.role === "admin") {
      return res.status(400).json({ message: "Admin cannot be deleted!" });
    }

    // 2. IMPORTANT: User delete karne se pehle uski saari bookings saaf karo
    // Isse occupancy grid khali ho jayegi aur dashboard se empty rows hat jayengi
    await Booking.deleteMany({ user: userId }); 

    // 3. Ab user ko delete karo
    await User.findByIdAndDelete(userId);

    res.json({ message: "User and all their bookings removed successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// routes/authRoutes.js

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    // check OTP
if (String(user.resetOTP) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

// check OTP expiry
if (user.otpExpire < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}

    // Password hash karke update karna (bcrypt use karein)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.json({ message: "Password updated successfully! Please login now." });
  } catch (error) {
    res.status(500).json({ message: "Server error during password reset" });
  }
});
router.post("/send-otp", async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in database
    user.resetOTP = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 
    await user.save();

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
    });

    // Email message
    const mailOptions = {
      from: "Movie Booking",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});
router.post("/send-register-otp", async (req, res) => {

  try {

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: "Movie Booking",
      to: email,
      subject: "Registration OTP",
      text: `Your registration OTP is ${otp}`
    };

    await transporter.sendMail(mailOptions);

    global.registerOTP = otp;
    global.registerEmail = email;

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "OTP sending failed" });
  }

});
router.post("/verify-register-otp", async (req, res) => {

  try {

    const { name, email, password, otp } = req.body;

    if (otp !== global.registerOTP || email !== global.registerEmail) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }

});

module.exports = router;