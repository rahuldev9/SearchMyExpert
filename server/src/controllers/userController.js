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

    if (user.role === "EXPERT") {
      projects = await Project.find({
        selectedExpert: userId,
        status: "COMPLETED",
      }).select("title budget");

      reviews = await Review.find({
        expertId: userId,
      }).populate("businessId", "name");
    }

    if (user.role === "BUSINESS") {
      projects = await Project.find({
        businessId: userId,
      }).select("title status budget");

      reviews = await Review.find({
        businessId: userId,
      }).populate("expertId", "name");
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
