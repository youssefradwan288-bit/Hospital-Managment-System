require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/users.route");
const appointmentRoutes = require("./routes/appointment.route.js");
const reviewRoutes = require("./routes/review.route.js");
const paymentRoutes = require("./routes/payment.route.js");

const app = express();

app.use(express.json());

// Users routes
app.use("/users", userRouter);

// Appointment routes
app.use("/api/appointments", appointmentRoutes);

// Review routes
app.use("/api/reviews", reviewRoutes);

// Payment routes
app.use("/api/payments", paymentRoutes);

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