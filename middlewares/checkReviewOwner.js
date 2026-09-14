const Review = require("../models/review.model");

const checkReviewOwner = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.patient.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this review",
      });
    }

    req.review = review;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { checkReviewOwner };