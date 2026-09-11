const mongoose = require("mongoose");
require("./users.model");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Confirmed"],
      default: "Pending",
    },
    appointmentType: {
      type: String,
      default: "Follow-up",
    },
    queueNumber: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    isFollowUpAllowed: {
      type: Boolean,
      default: false,
    },
    followUpDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
