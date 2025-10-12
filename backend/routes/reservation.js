const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const auth = require("../middleware/userAuthentication");
const logAction = require("../utils/logger");
const adminAuth = require("../middleware/adminAuthentication");

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
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reservations for logged in users
router.get("/", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.userId });
    res.json({ reservations });
  } catch (error) {
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
    p;
    res.status(500).json({ message: "Failed to cancel reservation!" });
  }
});

// Fetch normally, by searching and by filtering
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { q, status, people, table, from, to } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (table) filter.table = table;

    if (from && to) {
      filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    let sortOptions = { createdAt: -1 };
    if (people === "high") sortOptions = { people: -1 };
    if (people === "low") sortOptions = { people: 1 };

    let reservation = await Reservation.find(filter)
      .populate("userId", "fullname email")
      .sort(sortOptions);

    if (q) {
      const search = req.query.q?.toLowerCase();
      reservation = reservation.filter(
        (r) =>
          r._id.toString().toLowerCase().includes(search) ||
          r.fullname.toString().toLowerCase().includes(search) ||
          r.table.toString().toLowerCase().includes(search)
      );
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// Update reservation status by admin
router.patch("/:id/status", adminAuth, async (req, res) => {
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

    if (!updatedReservation)
      return res.status(404).json({ message: "Reservation not found!" });

    res.json({ message: "Reservation status updated!", updatedReservation });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Single Id for details
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// Delete reservation
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
