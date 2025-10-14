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
const upload = require("../middleware/uploadMiddleware");
const Auditlog = require("../models/Auditlog");

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
    const resetLink = `${process.env.ADMIN_URL}/resetpassword/${resetToken}`;

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
      from: `"Sushi Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #F5BE32;">Sushi Restaurant Admin Panel</h2>
      <p>Hello Admin,</p>
      <p>We received a request to reset your admin panel password. To proceed, please click the button below:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #F5BE32; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
      </p>

      <p>If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetLink}" style="color: #1d4ed8;">${resetLink}</a></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9rem; color: #666;">If you did not request a password reset, please ignore this email or contact support immediately at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
    </div>
  `,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (err) {
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
      const imgUrl = req.files.img[0].path.replace(/\\/g, "/");
      const iconUrl = req.files.icon[0].path.replace(/\\/g, "/");

      // Creat new sushi document
      const newSushi = new Sushis({
        title,
        text,
        price,
        img: `/${imgUrl}`,
        icon: `/${iconUrl}`,
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

// GET all activities (optional: paginate)
router.get("/activity", adminAuthentication, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const logs = await Auditlog.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("userId", "fullname email");

    const total = await Auditlog.countDocuments();

    res.status(200).json({ total, logs });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// getting input fields
router.get("/settings", adminAuthentication, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// settings
router.put("/settings", adminAuthentication, async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { name, email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Verify pass if changing
    if (newPassword) {
      if (!currentPassword)
        return res
          .status(400)
          .json({ message: "Current password is required!" });

      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect!" });

      // Check if admin uses the same password as current
      const isSamePassword = await bcrypt.compare(newPassword, admin.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: "New password cannot be the same as your current password!",
        });
      }

      admin.password = newPassword;
    }

    // Update email and name
    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    res.status(200).json({
      message: "Settings updated successfully!",
      admin: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
