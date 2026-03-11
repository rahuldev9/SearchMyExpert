const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register", registerUser);

router.post("/login", loginUser);
// Get requests created by logged-in user

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = router;
