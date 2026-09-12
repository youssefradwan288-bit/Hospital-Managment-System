const appointmentModel = require("../models/appointment.model");

// Loads the appointment from :id ONE time and checks that the logged-in
// user is allowed to touch it:
// - the owning patient
// - the assigned doctor
// - or any doctor
//
// On success it attaches:
//   req.appointment       -> the mongoose document (not populated)
//   req.appointmentAccess -> { isOwnerPatient, isOwnerDoctor, isDoctor }
// so the controller does not have to re-fetch it or redo the checks.
const checkAppointmentAccess = async (req, res, next) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "الموعد غير موجود" });
    }

    const isOwnerPatient = appointment.patient.toString() === req.user.userId;
    const isOwnerDoctor = appointment.doctor.toString() === req.user.userId;
    const isDoctor = req.user.role === "doctor";

    if (!isOwnerPatient && !isOwnerDoctor && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this appointment",
      });
    }

    req.appointment = appointment;
    req.appointmentAccess = { isOwnerPatient, isOwnerDoctor, isDoctor };

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkAppointmentAccess };
