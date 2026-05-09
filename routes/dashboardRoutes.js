const express = require("express");
const User = require("../models/User");
const Notification = require("../models/Notification");
const isAuth = require("./authRoutes")
const router = express.Router();



router.get("/dashboard", isAuth, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const notifications = await Notification.find({}).sort({ date: 1 });
  res.render("dashboard", { 
    title: "Dashboard - Career Advisor", 
    user, 
    notifications 
  });
});


router.get("/notifications", isAuth, async (req, res) => {
  const notifications = await Notification.find({}).sort({ date: 1 });
  res.render("notifications", { 
    title: "Notifications - Career Advisor", 
    user: req.session.user || null,
    notifications 
  });
});


router.get("/resources", isAuth, (req, res) => {
  const resources = [
    { title: "Free eBook: Basics of B.Sc", link: "#" },
    { title: "How to prepare for Govt Exams", link: "#" },
    { title: "Skill Course: Web Development (free)", link: "#" }
  ];
  res.render("resources", { 
    title: "Resources - Career Advisor", 
    user: req.session.user || null,
    resources 
  });
});

module.exports = router;
