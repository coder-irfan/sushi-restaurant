const express = require("express");
const router = express.Router();
const Sushi = require("../models/Sushis");
const upload = require("../middleware/uploadMiddleware");
const adminAuthentication = require("../middleware/adminAuthentication");

// GET /api/sushi?q=roll (for searching and for normal fetching)
router.get("/", async (req, res) => {
  try {
    const search = req.query.q; // q is what we use in frontend: /api/sushi?q=roll → search will be "roll"
    let sushis;

    if (search) {
      const regex = new RegExp(search, "i"); // case insensitive
      sushis = await Sushi.find({
        $or: [{ title: regex }, { text: regex }],
      });
    } else {
      sushis = await Sushi.find().sort({ createdAt: -1 }); // Latest first
    }

    res.status(200).json(sushis);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

// fetch single sushi by id
router.get("/:id", async (req, res) => {
  try {
    const sushi = await Sushi.findById(req.params.id);
    if (!sushi) {
      return res.status(404).json({ message: "Sushi not found!" });
    }

    res.status(200).json(sushi);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update endpoint for updating a sushi
router.put(
  "/:id",
  adminAuthentication,
  upload.fields([{ name: "img" }, { name: "icon" }]),
  async (req, res) => {
    try {
      const { title, text, price } = req.body;

      const sushi = await Sushi.findById(req.params.id);
      if (!sushi) {
        return res.status(404).json({ message: "Sushi not found!" });
      }

      sushi.title = title || sushi.title; // if the new value exists, use it; otherwise keep the old value
      sushi.text = text || sushi.text;
      sushi.price = price || sushi.price;

      // This ensures that images are only replaced if a new file is uploaded.
      if (req.files?.img)
        sushi.img = `/${req.files.img[0].path.replace(/\\/g, "/")}`;
      if (req.files?.icon)
        sushi.icon = `/${req.files.icon[0].path.replace(/\\/g, "/")}`;

      await sushi.save();
      res.status(200).json({ message: "Sushi updated successfully!", sushi });
    } catch (error) {
      res.status(500).json({ message: "Server error!" });
    }
  }
);

// Delete sushi
router.delete("/:id", adminAuthentication, async (req, res) => {
  try {
    const sushi = await Sushi.findByIdAndDelete(req.params.id);
    if (!sushi) {
      return res.status(404).json({ message: "Sushi not found!" });
    }

    res.status(200).json({ message: "Sushi deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
