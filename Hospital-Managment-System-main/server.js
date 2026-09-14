require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Routes
const { midicineRouter } = require("./routes/midicine.route");
const { medicalReportsRouter } = require("./routes/medicalReports.route");
const appointmentRoutes = require("./routes/appointment.route");
const { userRouter } = require("./routes/users.route");
const { patientRouter } = require("./routes/patient.route");
const { notificationRouter } = require("./routes/notifications.route");
const { doctorRouter } = require("./routes/doctors.route");
const reviewRoutes = require("./routes/review.route");
const app = express();

app.use(express.json());

// Users route
app.use("/users", userRouter);

// Medicine routes
app.use("/api/medicines", midicineRouter);

// Medical Reports route
app.use("/api/medicalReports", medicalReportsRouter);

// Appointment route
app.use("/api/appointments", appointmentRoutes);

// Patient route
app.use("/patients", patientRouter);

// Notifications route
app.use("/api/notifications", notificationRouter);

// Doctors route
app.use("/doctors", doctorRouter);

mongoose
 .connect("mongodb+srv://youssef:123456ss@g-10.4udy20h.mongodb.net/Hospital-Managment-System")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 3000 , () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });