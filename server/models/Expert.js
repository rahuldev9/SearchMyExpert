const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  name: String,
  skills: [String],
  rating: Number,
  bio: String,
});

module.exports = mongoose.model("Expert", expertSchema);
