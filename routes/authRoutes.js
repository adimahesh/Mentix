const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

const router = express.Router();

// GET signup
router.get("/signup", (req, res) => {
  res.render("signup", { 
    error: null,
    title: "Sign Up - Career Advisor",
    user: req.session.user || null 
  });
});

// POST signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.render("signup", { 
        error: "Email already registered", 
        title: "Sign Up - Career Advisor",
        user: req.session.user || null
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, age, gender });
    await user.save();

    req.session.user = { _id: user._id, name: user.name, email: user.email };
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("signup", { 
      error: "Something went wrong", 
      title: "Sign Up - Career Advisor",
      user: req.session.user || null
    });
  }
});

// GET login
router.get("/login", (req, res) => {
  res.render("login", { 
    error: null,
    title: "Login - Career Advisor", 
    user: req.session.user || null 
  });
});

// POST login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", { 
        error: "Invalid credentials",
        title: "Login - Career Advisor",
        user: req.session.user || null
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", { 
        error: "Invalid credentials",
        title: "Login - Career Advisor",
        user: req.session.user || null
      });
    }

    req.session.user = { _id: user._id, name: user.name, email: user.email };
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("login", { 
      error: "Something went wrong",
      title: "Login - Career Advisor",
      user: req.session.user || null
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
