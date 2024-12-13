const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL of the image
    trim: true,
  },
  video: {
    type: String, // URL of the video
    trim: true,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  votes: {
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  category: {
    type: String,
    enum: ["all", "student", "faculty"],
    required: true,
    default: "all",
  },
  branch: {
    type: String,
    enum: ["CSE", "CSM", "CSD"], // Add or modify branches as needed
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
