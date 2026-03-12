const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    projectTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    technologies: [
      {
        type: String,
      },
    ],

    projectLink: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    duration: {
      type: String,
    },

    budget: {
      type: Number,
    },

    completedAt: {
      type: Date,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
