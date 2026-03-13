const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: Number,

    comment: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
