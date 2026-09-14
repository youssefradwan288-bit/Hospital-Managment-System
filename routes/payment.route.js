const express = require("express");

const router = express.Router();

const {
  createPayment,
  getAllPayments,
  updatePayment,
} = require("../controllers/payment.controller");

const { authenticate } = require("../middlewares/isLogged.js");
const { checkPaymentOwner } = require("../middlewares/checkPaymentOwner");

router
  .route("/")
  .get(getAllPayments)
  .post(authenticate, createPayment);

router
  .route("/:id")
  .put(authenticate, checkPaymentOwner, updatePayment);

module.exports = router;