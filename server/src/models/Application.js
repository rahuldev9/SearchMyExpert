const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },

  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
