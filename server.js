require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Routes
const { midicineRouter } = require("./routes/midicine.route");
const { medicalReportsRouter } = require("./routes/medicalReports.route");
const appointmentRoutes = require("./routes/appointment.route");
const { userRouter } = require("./routes/users.route");
const { patientRouter } = require("./routes/patient.route");

const app = express();

app.use(express.json());

// Users routes
app.use("/users", userRouter);

// Medicine routes
app.use("/api/medicines", midicineRouter);

// Medical Reports routes
app.use("/api/medicalReports", medicalReportsRouter);

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

// Patient routes
app.use("/patients", patientRouter);

mongoose
  .connect(process.env.DB_LINK)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });