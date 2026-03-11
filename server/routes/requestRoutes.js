const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const authMiddleware = require("../middleware/authMiddleware");

// POST request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const request = new Request({
      title,
      description,
      budget,
      createdBy: req.user.id, // store logged in user id
    });

    await request.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get requests created by logged in user
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });
    console.log(req.user.id);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all requests
router.get("/", async (req, res) => {
  const requests = await Request.find();

  res.json(requests);
});

module.exports = router;
