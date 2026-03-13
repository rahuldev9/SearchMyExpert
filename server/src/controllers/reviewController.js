const Review = require("../models/Review");
const User = require("../models/User");

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { projectId, expertId, rating, comment } = req.body;

    const review = await Review.create({
      projectId,
      expertId,
      businessId: req.user.id,
      rating,
      comment,
    });

    // update expert rating
    const expert = await User.findById(expertId);

    expert.ratingAvg =
      (expert.ratingAvg * expert.totalReviews + rating) /
      (expert.totalReviews + 1);

    expert.totalReviews += 1;

    await expert.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
