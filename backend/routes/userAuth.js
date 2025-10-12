const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authLimiter = require("../middleware/rateLimitter");
const authMiddleware = require("../middleware/userAuthentication");
const adminAuth = require("../middleware/adminAuthentication");
const logAction = require("../utils/logger");

// SignUp
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const { fullname, email, password, captcha } = req.body; // extract from the request body

    // Backend Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email!" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, number, and symbol!",
      });
    }

    if (!captcha) {
      return res.status(400).json({ message: "CAPTCHA is required!" });
    }

    // Verity CAPTCHA with google
    const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
    const captchaRes = await axios.post(captchaVerifyURL);

    if (!captchaRes.data.success) {
      return res.status(400).json({ message: "Failed CAPTCHA verification!" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // Create new user after verifying email
    const newUser = new User({
      fullname,
      email: email.trim().toLowerCase(),
      password,
      isVerified: true,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpire = Date.now() + 1000 * 60 * 15;

    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpire = verificationTokenExpire;
    newUser.isVerified = true;
    await newUser.save();

    logAction(newUser._id, "signup", {
      email: newUser.email,
      userId: newUser._id,
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

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
      subject: "Verify Your Email Address",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #F5BE32;">Welcome to Sushi Restaurant 🍣</h2>
      <p>Hello,</p>
      <p>Thank you for creating an account with us! To get started, please verify your email address by clicking the button below:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #F5BE32; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
      </p>

      <p>If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;"><a href="${verificationLink}" style="color: #1d4ed8;">${verificationLink}</a></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9rem; color: #666;">If you did not create an account, please ignore this email or contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
    </div>
  `,
    });

    res.status(201).json({
      message: "Verification email sent!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// LogIn
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password, rememberMe, captcha } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logAction(user._id, "login failed", { ip: req.ip });
      return res.status(401).json({ message: "Invalid credential" });
    }

    // Verify captcha
    if (!captcha) {
      return res.status(400).json({ message: "Please verify CAPTCHA!" });
    }

    const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
    const captchaRes = await axios.post(captchaVerifyURL);

    if (!captchaRes.data.success) {
      return res.status(400).json({ message: "Failed CAPTCHA verification!" });
    }

    logAction(user._id, "login success", {
      email: user.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in!" });
    }

    const expiresIn = rememberMe ? "7d" : "2h"; // This way users who don’t check remember me get automatically logged out after 2 hours (more secure).

    const token = jwt.sign(
      {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      message: "Login Successful!",
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Get logged-in user
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password request
router.post("/forgotpassword", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 1000 * 60 * 15; // 15 Mins

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // Create reset link
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
      from: `"Sushi Restaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #F5BE32;">Hello,</h2>
      <p>We received a request to reset your password for your <strong>Sushi Restaurant 🍣</strong> account. If you made this request, please use the button below to set a new password.</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #F5BE32; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
      </p>

      <p>If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetLink}" style="color: #1d4ed8;">${resetLink}</a></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9rem; color: #666;">If you did not request a password reset, please ignore this email or contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a> for assistance.</p>
    </div>
  `,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Reset password (user clicks link, frontend sends new password)
router.post("/resetpassword/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token!" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    logAction(user._id, "password reset requested", { email: user.email });

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error:", error: error.message });
  }
});

// Verification routes
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token!" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    logAction(user._id, "verify email", { email: user.email });

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Resend verification email
router.post("/resend-verification", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified!" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpire = Date.now() + 1000 * 60 * 15;

    user.verificationToken = verificationToken;
    user.verificationTokenExpire = verificationTokenExpire;
    await user.save();

    logAction(user._id, "verify email - resent", { email: user.email });

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

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
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #F5BE32; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
          </p>

          <p>If the button above does not work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all;"><a href="${verificationLink}" style="color: #1d4ed8;">${verificationLink}</a></p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 0.9rem; color: #666;">If you did not sign up for this account, please ignore this email. <br />For support, contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
        </div>
      `,
    });

    res
      .status(200)
      .json({ message: "Verification email resent! Check your inbox." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch users for admin
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ message: "Users not found!" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// Delete user by admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
