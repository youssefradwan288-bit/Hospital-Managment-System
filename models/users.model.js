const mongoose = require('mongoose');
require('./users.model.js'); 

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number",
      ],
    },

    role: {
      type: String,
      enum: ["user", "doctor"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

});

module.exports = mongoose.model('Appointment', appointmentSchema);