const express = require("express");
const router = express.Router();

const {
  createProject,
  applyProject,
  acceptExpert,
  completeProject,
  getMyProjects,
  getProject,
  updateProject,
  getAllProjects,
  deleteProject,
  getExpertProjects,
  closeProject,
  addReview,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
router.get("/", protect, getAllProjects);
router.post("/create", protect, createProject);

router.get("/my-projects", protect, getMyProjects); // FIRST

router.get("/expert-projects", protect, getExpertProjects);

router.post("/:id/apply", protect, applyProject);

router.post("/:id/accept", protect, acceptExpert);

router.post("/:id/complete", protect, completeProject);
router.delete("/:id", protect, deleteProject);
router.get("/:id", protect, getProject); // LAST
router.put("/:id", protect, updateProject);
router.post("/:id/complete", protect, completeProject);
router.post("/:id/review", protect, addReview);
router.post("/:id/close", protect, closeProject);
module.exports = router;
