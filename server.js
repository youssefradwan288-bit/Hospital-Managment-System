const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/users.route.js");
const { error } = require("console");
const { connectDB } = require("./config/db.config.js");
const { PORT } = require("./config/env.config.js");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use("/users", userRouter);

connectDB();

app.listen(PORT, () => {
  console.log("Server is running");
}); 