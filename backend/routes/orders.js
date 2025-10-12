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
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders for logged in users (protected)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.userId });
    res.json(orders);
  } catch (err) {
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
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

// Normal fetching for admins, searching and filtering
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { q, status, country, from, to, sort } = req.query;

    const filter = {};

    if (status) filter.status = status; // If status exists in query, only orders with this status will be fetched.
    if (country) filter.country = new RegExp(country, "i");
    if (from && to) {
      filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "high") sortOptions = { totalPrice: -1 };
    if (sort === "low") sortOptions = { totalPrice: 1 };

    let orders = await Orders.find(filter)
      .populate("userId", "fullname email") // replaces the ID with actual user data (fullname and email).
      .sort(sortOptions);

    if (q) {
      const search = req.query.q?.toLowerCase();
      orders = orders.filter(
        (order) =>
          order._id.toString().toLowerCase().includes(search) ||
          order.fullname?.toLowerCase().includes(search) ||
          order.country?.toLowerCase().includes(search) ||
          order.city?.toLowerCase().includes(search) ||
          order.items.some((i) => i.title.toLowerCase().includes(search))
      );
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status (for admin or later)
router.patch("/:id/status", adminAuth, async (req, res) => {
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

    res.json({ message: "Order status updated!", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Single Id for details
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// Deleting order
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
