const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.body;

    const application = new Application({
      requestId,
      expertId: req.user.id,
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/accept/:id", async (req, res) => {
  const application = await Application.findById(req.params.id);

  application.status = "accepted";

  await application.save();

  res.json(application);
});

router.post("/reject/:id", async (req, res) => {
  const application = await Application.findById(req.params.id);

  application.status = "rejected";

  await application.save();

  res.json(application);
});

router.patch("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      expertId: req.user.id,
    })
      .populate("requestId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
