const notificationModel = require("../models/notifications.models");

// Loads the notification from :id ONE time and checks that the logged-in
// user is allowed to touch it (the recipient, or an admin).
// On success it attaches req.notification so the controller does not
// have to re-fetch it or redo the ownership check.
const checkNotificationAccess = (req, res, next) => {
  const notificationId = req.params.id;

  if (!notificationId) {
    return res
      .status(400)
      .json({ success: false, message: "Notification ID is required" });
  }

  return notificationModel
    .findById(notificationId)
    .then((notification) => {
      if (!notification) {
        return res
          .status(404)
          .json({ success: false, message: "Notification not found" });
      }

      const isOwner = notification.recipient.toString() === req.user.userId;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You are not allowed to perform this action on this notification.",
        });
      }

      req.notification = notification;
      next();
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

module.exports = { checkNotificationAccess };