const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: { type: String, required: true },

    email: { type: String, unique: true, required: true },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["business", "expert"],
      default: null,
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
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    bio: { type: String, default: "" },

    // ================= EXPERT PROFILE =================
    skills: [{ type: String }],

    experience: {
      type: Number,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      default: null,
    },

    portfolio: [{ type: String }],

    // ================= BUSINESS PROFILE =================
    companyName: { type: String, default: "" },
    companySize: { type: String, default: "" },
    industry: { type: String, default: "" },

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

    // ================= PLATFORM =================
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
