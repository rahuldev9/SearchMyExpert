const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  rating: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const portfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["business", "expert"],
      default: "business",
    },

    skills: [String],

    rating: {
      type: Number,
      default: 0,
    },

    completedProjects: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    portfolio: [portfolioSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
