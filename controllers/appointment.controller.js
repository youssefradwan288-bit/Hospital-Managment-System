const Appointment = require('../models/appointment.model');
require("../models/users.model");
// 1. إنشاء موعد جديد
const createAppointment = async (req, res) => {
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. جلب كل المواعيد
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .populate('department', 'name');
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. تحديث موعد (مثل إضافة التشخيص أو تغيير الحالة)
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'الموعد غير موجود' });
    }
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  updateAppointment
};