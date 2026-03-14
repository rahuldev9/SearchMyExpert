const User = require("../models/User");

// GET experts only
exports.getExperts = async (req, res) => {
  try {
    const experts = await User.find({ role: "expert", isActive: true });
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await User.find({ role: "business" }).select(
      "-password",
    );

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
