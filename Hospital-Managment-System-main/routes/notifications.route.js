const express = require("express");
const { authenticate } = require("../middlewares/isLogged");
const {
  getMyNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notifications.controller");

const notificationRouter = express.Router();

// All notification routes require a logged-in user
notificationRouter.use(authenticate);

// Get my notifications (?unread=true to filter)
notificationRouter.get("/", getMyNotifications);

// Create a notification for another user
notificationRouter.post("/", createNotification);

// 1. الثابت الأول (read-all قبل :id عشان ما يحصلش تداخل)
notificationRouter.patch("/read-all", markAllAsRead);

// 2. المتغير بعد كده (:id)
notificationRouter.get("/:id", getNotificationById);
notificationRouter.patch("/:id/read", markAsRead);
notificationRouter.delete("/:id", deleteNotification);

module.exports = {
  notificationRouter,
};