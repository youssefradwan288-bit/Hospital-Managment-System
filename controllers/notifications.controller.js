const notificationModel = require("../models/notifications.models");

// ==========================
// 1. Get My Notifications
// ==========================
const getMyNotifications = async (req, res) => {
  try {
    const filter = { recipient: req.user.userId };

    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const notifications = await notificationModel
      .find(filter)
      .populate("sender", "name role email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      count: notifications.length, 
      data: notifications 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 2. Get Notification By ID
// ==========================
const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationModel
      .findById(req.params.id)
      .populate("sender", "name role email");

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    const isOwner = notification.recipient.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "You are not allowed to view this notification" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 3. Create Notification
// ==========================
const createNotification = async (req, res) => {
  try {
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
        message: "recipient, title and message are required" 
      });
    }

    const newNotification = await notificationModel.create({
      recipient,
      sender: req.user.userId,
      type,
      title,
      message,
      relatedAppointment,
      relatedMedicalReport,
    });

    return res.status(201).json({ success: true, data: newNotification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 4. Mark As Read
// ==========================
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    const isOwner = notification.recipient.toString() === req.user.userId;

    if (!isOwner) {
      return res.status(403).json({ success: false, message: "You are not allowed to update this notification" });
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();

    return res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 5. Mark All As Read
// ==========================
const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { recipient: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ 
      success: true, 
      message: "All notifications marked as read successfully" 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================
// 6. Delete Notification
// ==========================
const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationModel.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    const isOwner = notification.recipient.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "You are not allowed to delete this notification" });
    }

    await notificationModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};