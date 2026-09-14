const appointmentModel = require("../models/appointment.model");
const patientModel = require("../models/patient.model");
const doctorModel = require("../models/doctors.model");

// ==========================
// 1. Create Appointment
// ==========================
const createAppointment = async (req, res) => {
  try {
    const isDoctor = req.user.role === "doctor";
    let patientId, doctorId;

    if (isDoctor) {
      if (!req.body.patient) {
        return res.status(400).json({ success: false, message: "patient is required" });
      }

      const patientExists = await patientModel.findById(req.body.patient);
      if (!patientExists) {
        return res.status(404).json({ success: false, message: "Patient not found" });
      }
      patientId = patientExists._id;

      const doctorProfile = await doctorModel.findOne({ user: req.user.userId });
      if (!doctorProfile) {
        return res.status(404).json({ success: false, message: "Doctor profile not found" });
      }
      doctorId = doctorProfile._id;
    } else {
      const patientProfile = await patientModel.findOne({ user: req.user.userId });
      if (!patientProfile) {
        return res.status(404).json({ success: false, message: "Patient profile not found" });
      }
      patientId = patientProfile._id;

      if (!req.body.doctor) {
        return res.status(400).json({ success: false, message: "doctor is required" });
      }

      const doctorExists = await doctorModel.findById(req.body.doctor);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      doctorId = doctorExists._id;
    }

    const { date, time, appointmentType, notes } = req.body;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: "date and time are required" });
    }

    const sameDayCount = await appointmentModel.countDocuments({ doctor: doctorId, date });

    const newAppointment = await appointmentModel.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      appointmentType,
      notes,
      queueNumber: sameDayCount + 1,
    });

    return res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 2. Get All Appointments
// ==========================
const getAllAppointments = async (req, res) => {
  try {
    const isDoctor = req.user.role === "doctor";
    const isAdmin = req.user.role === "admin";

    let filter = {};

    if (isAdmin) {
      filter = {};
    } else if (isDoctor) {
      const doctorProfile = await doctorModel.findOne({ user: req.user.userId });
      if (!doctorProfile) {
        return res.status(404).json({ success: false, message: "Doctor profile not found" });
      }
      filter = { doctor: doctorProfile._id };
    } else {
      const patientProfile = await patientModel.findOne({ user: req.user.userId });
      if (!patientProfile) {
        return res.status(404).json({ success: false, message: "Patient profile not found" });
      }
      filter = { patient: patientProfile._id };
    }

    const appointments = await appointmentModel
      .find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1, queueNumber: 1 });

    return res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 3. Get Appointment By ID
// ==========================
const getAppointmentById = async (req, res) => {
  try {
    await req.appointment.populate([
      { path: "patient", select: "name email" },
      { path: "doctor", select: "name email" },
    ]);

    return res.status(200).json({ success: true, data: req.appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 4. Update Appointment
// ==========================
const updateAppointment = async (req, res) => {
  try {
    const { isDoctor, isAdmin } = req.appointmentAccess;
    let updateData = req.body;

    if (!isDoctor && !isAdmin) {
      updateData = {};
      if (req.body.notes !== undefined) updateData.notes = req.body.notes;
      if (req.body.status === "Cancelled") updateData.status = "Cancelled";
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 5. Delete Appointment
// ==========================
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};