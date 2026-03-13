const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  comment: String,

  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  businessTotalProjects: {
    type: Number,
    default: 0,
  },

  businessRating: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["business", "expert"],
      required: true,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    // ================= COMMON PROFILE =================

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // ================= EXPERT PROFILE =================

    skills: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      default: null,
    },

    portfolio: [
      {
        type: String,
      },
    ],

    // ================= BUSINESS PROFILE =================

    companyName: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    // ================= EXPERT STATS =================

    totalProjects: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],

    // ================= PLATFORM =================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
