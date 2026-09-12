require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Routes
const { midicineRouter } = require("./routes/midicine.route");
const { medicalReportsRouter } = require("./routes/medicalReports.route");
const appointmentRoutes = require("./routes/appointment.route");
const { userRouter } = require("./routes/users.route");
const { patientRouter } = require("./routes/patient.route");
const notificationRoutes = require("./routes/notifications.route");

const app = express();

app.use(express.json());

// Users route
app.use("/users", userRouter);

// Medicine route
app.use("/api/midicine", midicineRouter);

// Medical Reports route
app.use("/api/medicalReports", medicalReportsRouter);

// Appointment route
app.use("/api/appointments", appointmentRoutes);

// Patient route
app.use("/patients", patientRouter);

// Notifcations route
app.use("/api/notifications", notificationRoutes);

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
