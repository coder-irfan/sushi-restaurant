const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensures uploads folder exists
const uploadDir = "uploads/";
// Checks if the uploads/ folder already exists.
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // If it doesn’t exist, create it.

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Function that tells multer where to save uploaded files.
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    // uniqueSuffix Generates a unique prefix to avoid overwriting files.
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Random numbers up to 1b, combines them with - that makes a unique string. Prevents two uploaded images from having the same name and overwriting each other.
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Keeps the original file extension .jpg...
  },
});

// File filter to only allow images only and also only webp format
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  // Tells the file type (like image/png or image/jpeg).
  if (file.mimetype === "image/webp" && ext === ".webp") {
    cb(null, true);
  } else {
    cb(new Error("Only image files with webp formart are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
