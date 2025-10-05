const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuthentication = require("../middleware/adminAuthentication");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Sushis = require("../models/Sushis");
const Orders = require("../models/Orders");
const Reservations = require("../models/Reservation");
const Users = require("../models/User");
const Activity = require("../models/Auditlog");
const path = require("path");
const upload = require("../middleware/uploadMiddleware");

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required!" });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard-data", adminAuthentication, (req, res) => {
  res.json({ message: "Only admins can access this", admin: req.admin });
});

// forgotpassword
router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found!" });

    // Generate reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 1000 * 60 * 15;

    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpire = resetTokenExpire;
    await admin.save();

    // Create resend link
    const resetLink = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sushi Restaurant 🍣" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    console.error("Nodemailer error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Resend password reset
router.post("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin)
      return res.status(400).json({ message: "Invalid or expired token!" });

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch total numbers of items
router.get("/stats", adminAuthentication, async (req, res) => {
  try {
    const allSushis = await Sushis.countDocuments();
    const ordersCount = await Orders.countDocuments();
    const reservationsCount = await Reservations.countDocuments();
    const usersCount = await Users.countDocuments();
    const activityCount = await Activity.countDocuments();

    res.json({
      sushis: allSushis,
      orders: ordersCount,
      reservations: reservationsCount,
      users: usersCount,
      activity: activityCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Errors fetching stats" });
  }
});

// Uploading new sushi as admin
router.post(
  "/add-sushi",
  adminAuthentication,
  upload.fields([
    { name: "img", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, text, price } = req.body;

      // Chekc required fields
      if (!title || !text || !price) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      // Check if files exist
      if (!req.files || !req.files.img || !req.files.icon) {
        return res.status(400).json({ message: "Both images are required!" });
      }

      // Extract file paths
      const imgUrl = req.files.img[0].path;
      const iconUrl = req.files.icon[0].path;

      // Creat new sushi document
      const newSushi = new Sushis({
        title,
        text,
        price,
        img: imgUrl,
        icon: iconUrl,
      });

      await newSushi.save();

      res
        .status(201)
        .json({ message: "Sushi added successfully!", sushi: newSushi });
    } catch (error) {
      // Catch multer errors and general errors
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size should not exceed 2MB!" });
      }

      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
