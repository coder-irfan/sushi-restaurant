const express = require("express");
const router = express.Router();
const Orders = require("../models/Orders");
const auth = require("../middleware/userAuthentication");
const adminAuth = require("../middleware/adminAuthentication");

router.post("/", auth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      fullname,
      email,
      country,
      city,
      address,
      zipcode,
      phone,
    } = req.body;

    // Get userId from token from middleware/auth
    const userId = req.userId;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !fullname ||
      !email ||
      !country ||
      !city ||
      !address ||
      !zipcode ||
      !phone
    ) {
      return res.status(400).json({ message: "Invalid order data!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email!" });
    }

    const zipcodeRegex = /^\d{4,10}$/;
    if (!zipcodeRegex.test(zipcode)) {
      return res.status(400).json({ message: "Zip code must be 4-10 digits!" });
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    const newOrder = new Orders({
      userId,
      items,
      totalAmount,
      status: "pending", // Default status (can be changed later)
      fullname,
      email,
      country,
      city,
      address,
      zipcode,
      phone,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order saved successfully!", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders for logged in users (protected)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.userId });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (for admin or later)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "paid",
      "shipped",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel order if users clicks on cancel button
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Orders.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    // Only allow cancel if pending
    if (!["pending"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    /* Use findByIdAndUpdate with runValidators: false — this updates only the status field without validating fullname, phone, etc.
    if you use only order.save, it will throw error for required fields! */
    const updatedOrder = await Orders.findByIdAndUpdate(
      order._id,
      { status: "cancelled" },
      { new: true, runValidators: false }
    );

    res.json({ message: "Order cancelled successfully!", updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

// Get all orders (Only Admin)
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
