const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/isLogged");
const { authorize } = require("../middlewares/authorize");
const { checkAppointmentAccess } = require("../middlewares/appointmentAccess");
const {
  createAppointmentValidationRules,
  updateAppointmentValidationRules,
  validate,
} = require("../middlewares/appointmentValidation");

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointment.controller");

// All appointment routes require a logged-in user
router.use(authenticate);

router
  .route("/")
  .get(getAllAppointments)
  .post(createAppointmentValidationRules, validate, createAppointment);

router
  .route("/:id")
  .get(checkAppointmentAccess, getAppointmentById)
  .put(
    updateAppointmentValidationRules,
    validate,
    checkAppointmentAccess,
    updateAppointment,
  )
  .delete(authorize("doctor"), deleteAppointment);

module.exports = router;
