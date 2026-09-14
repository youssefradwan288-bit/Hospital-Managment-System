const Review = require("../models/review.model");

require("../models/users.model");
require("../models/appointment.model");

// ==========================
// 1. Create Review
// ==========================
const createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// 2. Get All Reviews
// ==========================
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("appointment");

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// 3. Update Review
// (Auth & Access handled by checkReviewAccess middleware)
// ==========================
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// 4. Delete Review
// (Auth & Access handled by checkReviewAccess middleware)
// ==========================
const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};