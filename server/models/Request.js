const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  hiredExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  status: {
    type: String,
    enum: ["open", "in-progress", "completed"],
    default: "open",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema);
