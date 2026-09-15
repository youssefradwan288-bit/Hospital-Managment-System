const notificationModel = require("../models/notifications.models");

// ==========================
// 1. Get My Notifications
// ==========================
const getMyNotifications = (req, res) => {
  const filter = { recipient: req.user.userId };

  if (req.query.unread === "true") {
    filter.isRead = false;
  }

  return notificationModel
    .find(filter)
    .populate("sender", "name role email")
    .sort({ createdAt: -1 })
    .then((notifications) => {
      res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

// ==========================
// 2. Get Notification By ID
// Auth + ownership already handled by checkNotificationAccess middleware
// ==========================
const getNotificationById = (req, res) => {
  return req.notification
    .populate("sender", "name role email")
    .then((notification) => {
      res.status(200).json({ success: true, data: notification });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

// ==========================
// 3. Create Notification
// ==========================
const createNotification = (req, res) => {
  const {
    recipient,
    type,
    title,
    message,
    relatedAppointment,
    relatedMedicalReport,
  } = req.body;

  if (!recipient || !title || !message) {
    return res.status(400).json({
      success: false,
      message: "recipient, title and message are required",
    });
  }

  return notificationModel
    .create({
      recipient,
      sender: req.user.userId,
      type,
      title,
      message,
      relatedAppointment,
      relatedMedicalReport,
    })
    .then((newNotification) => {
      res.status(201).json({ success: true, data: newNotification });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

// ==========================
// 4. Mark As Read
// Auth + ownership already handled by checkNotificationAccess middleware
// NOTE: the middleware allows the owner OR an admin through. The old
// controller only allowed the owner (not admin) to mark as read - if you
// want to keep that stricter rule here, re-add an owner-only check using
// req.notification.recipient vs req.user.userId before saving.
// ==========================
const markAsRead = (req, res) => {
  req.notification.isRead = true;

  return req.notification
    .save()
    .then((updatedNotification) => {
      res.status(200).json({ success: true, data: updatedNotification });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

// ==========================
// 5. Mark All As Read
// ==========================
const markAllAsRead = (req, res) => {
  return notificationModel
    .updateMany(
      { recipient: req.user.userId, isRead: false },
      { $set: { isRead: true } },
    )
    .then(() => {
      res.status(200).json({
        success: true,
        message: "All notifications marked as read successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

// ==========================
// 6. Delete Notification
// Auth + ownership already handled by checkNotificationAccess middleware
// ==========================
const deleteNotification = (req, res) => {
  return notificationModel
    .findByIdAndDelete(req.notification._id)
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};

module.exports = {
  getMyNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};