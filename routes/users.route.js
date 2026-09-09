const express = require("express");

const userRouter = express.Router();

const {
  getUsers,
  addData,
  updateData,
  deleteData,
} = require("../controllers/users.controller");

userRouter.get("/", getUsers);

userRouter.post("/", updateData);

userRouter.put("/", addData);

userRouter.delete("/", deleteData);

module.exports = { userRouter };
