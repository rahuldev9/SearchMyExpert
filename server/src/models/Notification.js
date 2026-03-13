const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "PROJECT_POSTED",
        "PROJECT_APPLIED",
        "APPLICATION_ACCEPTED",
        "APPLICATION_REJECTED",
        "PROJECT_COMPLETED",
        "PROJECT_REVIEWED",
        "PROJECT_CLOSED",
      ],
      required: true,
    },

    title: String,
    message: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
