const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    budget: Number,

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    selectedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "COMPLETED", "CLOSED"],
      default: "OPEN",
    },

    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date,
    },

    applicants: [
      {
        expertId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["APPLIED", "APPROVED", "REJECTED"],
          default: "APPLIED",
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
