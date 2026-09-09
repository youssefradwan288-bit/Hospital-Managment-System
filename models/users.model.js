const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  isActive: Boolean,
  lastLoginDate: Date,
  createdAt: Date,
  updatedAt : Date
});

const userModel = mongoose.model("users", userSchema);

module.exports = { userModel };