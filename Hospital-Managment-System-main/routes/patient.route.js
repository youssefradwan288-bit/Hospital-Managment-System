const express = require("express");

const { authenticate } = require("../middlewares/isLogged");
const { authorize } = require("../middlewares/authorize");

const {
  getPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

const patientRouter = express.Router();

// Get all patients - doctors only
patientRouter.get("/", authenticate, authorize("doctor", "admin"), getPatients);

// Get a single patient - the patient themselves, or a doctor and admin
patientRouter.get("/:id", authenticate, getPatientById);

// Create a patient profile - any logged-in user (for their own account)
patientRouter.post("/", authenticate, addPatient);

// Update a patient - owner or a doctor
patientRouter.put("/:id", authenticate, updatePatient);

// Delete a patient - doctors only
patientRouter.delete("/:id", authenticate, authorize("doctor", "admin"), deletePatient);

module.exports = {
  patientRouter,
};
