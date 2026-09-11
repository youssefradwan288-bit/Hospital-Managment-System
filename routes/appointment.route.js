const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  updateAppointment
} = require('../controllers/appointment.controller');

router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment);

module.exports = router;