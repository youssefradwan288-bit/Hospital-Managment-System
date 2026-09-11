require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
require("./models/users.model.js");

const { userRouter } = require("./routes/users.route.js");
const appointmentRoutes = require("./routes/appointment.route.js");
const { connectDB } = require("./config/db.config.js");
const { PORT } = require("./config/env.config.js");

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/api/appointments", appointmentRoutes);

connectDB();

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});