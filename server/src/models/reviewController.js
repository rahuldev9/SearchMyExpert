const Review = require("../models/Review");
const User = require("../models/User");

exports.createReview = async (req, res) => {
  const { projectId, expertId, rating, comment } = req.body;

  await Review.create({
    projectId,
    expertId,
    businessId: req.user.id,
    rating,
    comment,
  });

  const expert = await User.findById(expertId);

  expert.ratingAvg =
    (expert.ratingAvg * expert.totalReviews + rating) /
    (expert.totalReviews + 1);

  expert.totalReviews += 1;

  await expert.save();

  res.json({ message: "Review added" });
};
