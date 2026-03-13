const User = require("../models/User");
const Project = require("../models/Project");
const Review = require("../models/Review");

exports.getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let projects = [];
    let reviews = [];

    // EXPERT PROFILE
    if (user.role === "EXPERT") {
      projects = await Project.find({
        selectedExpert: userId,
        status: { $in: ["COMPLETED", "CLOSED"] }, // check both
      }).select("title budget status");

      reviews = await Review.find({
        expertId: userId,
      })
        .populate("businessId", "name avatar")
        .populate("projectId", "title budget status");
    }

    // BUSINESS PROFILE
    if (user.role === "BUSINESS") {
      projects = await Project.find({
        businessId: userId,
        status: { $in: ["COMPLETED", "CLOSED"] }, // optional but recommended
      }).select("title status budget");

      reviews = await Review.find({
        businessId: userId,
      })
        .populate("expertId", "name avatar")
        .populate("projectId", "title budget status");
    }

    res.json({
      user,
      projects,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
