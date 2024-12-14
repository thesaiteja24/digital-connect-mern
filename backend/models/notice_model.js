const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  video: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ["all", "student", "faculty"],
    required: true,
    default: "all",
  },
  branch: {
    type: String,
    enum: ["CSE", "CSM", "CSD"],
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