require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { userRouter } = require("./routes/users.route");

const app = express();

app.use(express.json());

// Users routes
app.use("/users", userRouter);
app.use("/api/appointments", appointmentRoutes);

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
