require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/userAuth");
const sushiRoutes = require("./routes/sushi");
const reservationRoutes = require("./routes/reservation");
const ordersRoutes = require("./routes/orders");
const Sushi = require("./models/Sushis");
const adminAuthRoutes = require("./routes/adminAuth");

const app = express();

// CORS configuration (production-ready)
// Allowed origins
const allowedOrigins = [
  /* "http://localhost:5173, http://localhost:5174, http://localhost:5000", */
  process.env.FRONTEND_URL, // frontend URL
  process.env.ADMIN_URL, // admin URL
];

// Middleware to handle CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman, server-to-server)
      if (!origin) return callback(null, true);

      // check if the origin is in our allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // origin not allowed
      return callback(new Error("CORS policy: This origin is not allowed."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sushi", sushiRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminAuthRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((error) => console.error("MongoDb Error:", error));

// Create sushi
app.post("/api/sushi", async (req, res) => {
  try {
    const newSushi = new Sushi(req.body);
    const savedSushi = await newSushi.save();
    res.status(200).json(savedSushi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete sushi
app.delete("/api/sushi/delete", async (req, res) => {
  try {
    await Sushi.deleteOne({});
    res.status(200).json({ message: "Sushi deleted!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete a sushi" });
  }
});

// Create many sushis
app.post("/api/sushi/bulk", async (req, res) => {
  try {
    const sushis = await Sushi.insertMany(req.body);
    res.status(200).json(sushis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete many sushis
app.delete("/api/sushi/bulk/delete", async (req, res) => {
  try {
    await Sushi.deleteMany({});
    res.status(200).json({ message: "All sushis deleted!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete sushis" });
  }
});

// Update format of images to webp
app.put("/api/sushi/update-images", async (req, res) => {
  try {
    const sushis = await Sushi.find();

    for (let s of sushis) {
      if (s.img) {
        s.img = s.img.replace(/\.jpg|\.svg/g, ".webp");
        await s.save();
      }
    }

    res.status(200).json({ message: "All sushi images updated to WebP!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Static images
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Fetching Middleware to protect routes (create a protected route /api/profile that only logged-in users (with a valid token) can access, and it returns their ID and email.)
const auth = require("./middleware/userAuthentication");
app.get("/api/profile", auth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
