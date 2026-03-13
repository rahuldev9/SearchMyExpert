const express = require("express");
const router = express.Router();

const {
  getChatProjects,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

router.get("/projects", protect, getChatProjects);

router.get("/:projectId", protect, getMessages);

router.post("/:projectId", protect, sendMessage);

module.exports = router;
