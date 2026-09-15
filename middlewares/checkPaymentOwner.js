const Payment = require("../models/payment.model");

const checkPaymentOwner = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.patient.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this payment",
      });
    }

    req.payment = payment;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { checkPaymentOwner };