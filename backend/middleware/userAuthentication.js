const jwt = require("jsonwebtoken");

// Basically, any route that uses this middleware becomes “protected”. Users must log in and send their token to access it.
module.exports = function auth(req, res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null; // "Bearer " is a standard prefix for JWT tokens.
  if (!token) return res.status(401).json({ message: "No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
