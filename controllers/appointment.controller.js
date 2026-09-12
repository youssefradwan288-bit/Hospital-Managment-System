const appointmentModel = require("../models/appointment.model");
require("../models/users.model");

// ==========================
// Create Appointment
// - "user" (patient) books with a doctor -> patient is forced to self
// - "doctor" books on behalf of a patient -> doctor is forced to self
// ==========================
const createAppointment = async (req, res) => {
  try {
    const isDoctor = req.user.role === "doctor";

    const patient = isDoctor ? req.body.patient : req.user.userId;
    const doctor = isDoctor ? req.user.userId : req.body.doctor;

    if (!patient || !doctor) {
      return res.status(400).json({
        success: false,
        message: isDoctor ? "patient is required" : "doctor is required",
      });
    }

    const { date, time, appointmentType, notes } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "date and time are required",
      });
    }

    // Auto-generate the queue number for this doctor on this date
    const sameDayCount = await appointmentModel.countDocuments({
      doctor,
      date,
    });

    const newAppointment = await appointmentModel.create({
      patient,
      doctor,
      date,
      time,
      appointmentType,
      notes,
      queueNumber: sameDayCount + 1,
    });

    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Get All Appointments
// - "doctor" sees appointments assigned to them
// - "user" (patient) sees only their own appointments
// ==========================
const getAllAppointments = async (req, res) => {
  try {
    const isDoctor = req.user.role === "doctor";
    const filter = isDoctor
      ? { doctor: req.user.userId }
      : { patient: req.user.userId };

    const appointments = await appointmentModel
      .find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1, queueNumber: 1 });

    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Get Appointment By ID
// Auth + ownership already handled by checkAppointmentAccess middleware
// ==========================
const getAppointmentById = async (req, res) => {
  try {
    await req.appointment.populate([
      { path: "patient", select: "name email" },
      { path: "doctor", select: "name email" },
    ]);

    res.status(200).json({ success: true, data: req.appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Update Appointment
// Auth + ownership already handled by checkAppointmentAccess middleware
// - the assigned doctor (or any doctor) can update everything
// - the owning patient can only cancel it or edit their notes
// ==========================
const updateAppointment = async (req, res) => {
  try {
    const { isDoctor } = req.appointmentAccess;

    let updateData = req.body;

    // A patient (non-doctor) may only cancel the appointment or edit notes
    if (!isDoctor) {
      updateData = {};
      if (req.body.notes !== undefined) updateData.notes = req.body.notes;
      if (req.body.status === "Cancelled") updateData.status = "Cancelled";
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// Delete Appointment (doctors only)
// ==========================
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
