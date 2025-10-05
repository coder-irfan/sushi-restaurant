const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuthentication = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization;

    if (!hdr || !hdr.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided!" });
    }

    const token = hdr.split(" ")[1];

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find Admin in DB
    const admin = await Admin.findById(decoded.id).select("-password"); // give me all fields except password
    if (!admin) {
      return res.status(401).json({ message: "Admin not found!" });
    }

    // Attach admin to req
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = adminAuthentication;
