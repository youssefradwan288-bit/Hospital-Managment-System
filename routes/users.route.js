const express = require("express");

const { authenticate } = require("../middlewares/isLogged");

const {
  registerValidationRules,
  validate,
} = require("../middlewares/registerValidation");

const {
  getUsers,
  getUserById,
  addUser,
  updateData,
  deleteUser,
  userLogin,
} = require("../controllers/users.controller");

const userRouter = express.Router();

// Get all users
userRouter.get("/", getUsers);

// Login
userRouter.post("/login", userLogin);

// Get user by ID
userRouter.get("/:id", getUserById);

// Register / Add user
userRouter.post("/", registerValidationRules, validate, addUser);

// Update user
userRouter.put("/:id", authenticate, updateData);

// Delete user
userRouter.delete("/:id", authenticate, deleteUser);

module.exports = {
  userRouter,
};
