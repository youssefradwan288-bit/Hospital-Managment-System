const express = require("express");

const router = express.Router();

const {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { authenticate } = require("../middlewares/isLogged.js");
const { checkReviewOwner } = require("../middlewares/checkReviewOwner");

router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, createReview);

router
  .route("/:id")
  .put(authenticate, checkReviewOwner, updateReview)
  .delete(authenticate, checkReviewOwner, deleteReview);

module.exports = router;