const crypto = require("crypto");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// For email verification after signing up
exports.signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const user = new User({ fullname, email, password });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpire = Date.now() + 3600000; // 1 hour

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifcationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    await transporter.sendMail({
      from: `"Sushi Restaurant" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Email Verification - Sushi Restaurant",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #F5BE32;">Welcome to Sushi Restaurant!</h2>
      <p>Hello,</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email by clicking the button below:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${verifcationLink}" style="background-color: #F5BE32; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
      </p>

      <p>If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all;"><a href="${verifcationLink}" style="color: #1d4ed8;">${verifcationLink}</a></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9rem; color: #666;">If you did not register, please ignore this email or contact support at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</p>
    </div>
  `,
    });

    res.status(200).json({
      message: "Signup successful, check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Endpoint of verifaction
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token!" });

    user.isVerified = true; // The account is now confirmed as verified.
    user.verificationToken = undefined; // Remove the token from DB so it can’t be reused.
    user.verificationTokenExpire = undefined; // Remove expiry field, since no longer needed.
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
