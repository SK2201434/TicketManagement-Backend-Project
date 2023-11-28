const { json } = require("express");
const reviewSchema = require("../models/reviewSchema");

// add review API
const addReviewDemo = async (req, res) => {
  const reviewData = new reviewSchema(req.body);
  try {
    // reviewData.userId = req.user._id;
    reviewData.projectId = req.params.pid;
    reviewData.taskId = req.params.pid;
    if (reviewData != null) {
      await reviewData.save();
      res.status(200).json({
        status: true,
        message: "Review Added successfully",
        Comment: reviewData,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.stack,
    });
  }
};

// show all review api
const showAllReview = async (req, res) => {
  try {
    const showAll = await reviewSchema.find();
    if (showAll != "") {
      return res.status(200).json({
        status: true,
        allReview: showAll,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "no review found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

// Update review API
const updateReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewData = await reviewSchema.findByIdAndUpdate(id, req.body);
    if (reviewData) {
      await reviewData.save();
      return res.status(200).json({
        status: true,
        message: "review updated successfully",
        updatereview: reviewData

      });
    } else {
      return res.status(401).json({
        status: false,
        message: "id not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.stack,
    });
  }
};

// delete review API
const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewDelete = await reviewSchema.findByIdAndDelete(id);
    if (reviewDelete) {
      return res.status(200).json({
        status: true,
        message: "review deleted successfully",
        deletedreveiw:reviewDelete
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Id not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

module.exports = {
  addReviewDemo,
  showAllReview,
  deleteReviewById,
  updateReviewById,
};
