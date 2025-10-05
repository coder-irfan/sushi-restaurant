const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const auth = require("../middleware/userAuthentication");
const logAction = require("../utils/logger");

router.post("/", auth, async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      people,
      table,
      date,
      time,
      comments,
      newsletter,
    } = req.body;

    // Get userId from token from auth/middleware
    const userId = req.userId;

    if (!fullname || !email || !phone || !people || !table || !date || !time) {
      return res.status(400).json({ message: "All field are required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email!" });
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    const newReservation = new Reservation({
      userId,
      fullname,
      email,
      phone,
      people,
      table,
      date,
      time,
      comments,
      newsletter,
      status: "pending",
    });

    await newReservation.save();

    logAction(newReservation._id, "reservation", {
      userId: req.userId,
      table: newReservation.table,
      people: newReservation.people,
      date: newReservation.date,
      time: newReservation.time,
      status: newReservation.status,
    });

    res.status(201).json({
      message: "Reservation booked successfully!",
      reservation: newReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reservations for logged in users
router.get("/", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.userId });
    res.json({ reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update reservation status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "no-show",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    res.json({ message: "Status updated", reservation: updatedReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reservation cancellation
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found!" });
    }

    // Only allow cancle if pending
    if (!["pending", "confirmed"].includes(reservation.status)) {
      return res.status(400).json({
        message: "Only pending or confirmed reservations can be cancelled",
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation._id,
      { status: "cancelled" },
      { new: true, runValidators: false }
    );

    res.json({
      message: "Reservation cancelled successfully!",
      updatedReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel reservation!" });
  }
});

module.exports = router;
