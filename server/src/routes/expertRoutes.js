const express = require("express");
const router = express.Router();

const User = require("../models/User");

// GET all experts
router.get("/experts", async (req, res) => {
  try {
    const experts = await User.find({ role: "expert" }).select(
      "name email skills rating",
    );

    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
