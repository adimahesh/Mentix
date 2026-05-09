const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  link: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
