const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  courses: [String],
  cutoff: String,
  facilities: [String],
  contact: String
});

module.exports = mongoose.model("College", collegeSchema);
