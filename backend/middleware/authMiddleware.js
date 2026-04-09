const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;   // save user info in request
    next();               // move to next step

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  next();
};

module.exports = { verifyToken, isAdmin };

