const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true,"Please Enter Subject "],
  },
  review: {
    type: String,
    required: [true,"Please Enter review "],
  },
  userId: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "userData",
  },
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "projectData",
  },
  taskId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "taskData",
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});
reviewSchema.set("timestamps", true);

module.exports = mongoose.model("reviewData", reviewSchema);
