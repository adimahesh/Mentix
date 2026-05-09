// models/User.js (important fields only)
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  gender: String,
  quizResults: { type: mongoose.Schema.Types.Mixed, default: {} },
  recommendations: {
    stream: String,
    scores: Object,
    courses: [String],
    careers: [String],
    exams: [String],
    explanation: String,
    generatedAt: Date
  }
});

module.exports = mongoose.model("User", UserSchema);
