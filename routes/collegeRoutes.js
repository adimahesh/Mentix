const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Authentication middleware
function isAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}


const collegesFile = path.join(__dirname, "../data/college-list.json");

// GET /colleges
router.get("/", isAuth, (req, res) => {
  let allColleges = JSON.parse(fs.readFileSync(collegesFile, "utf-8"));

  const colleges = allColleges.map((c, index) => ({
    id: c["S. No."] || index + 1,
    university: c["University Name"],
    name: c["College Name"],
    type: c["College Type"],
    state: c["State Name"],
    district: c["District Name"],
    courses: ["Engineering","Medical","Commerce","Arts"], // Placeholder
    facilities: ["Library","Hostel","Sports","Labs"] // Placeholder
  }));

  const { location, courses: selectedCourses, facilities: selectedFacilities, selected } = req.query;

  
const hasFilters = location || selectedCourses || selectedFacilities;


let filteredColleges = [];
if (hasFilters) {
  filteredColleges = [...colleges];

  if (location) {
    filteredColleges = filteredColleges.filter(col =>
      col.state.toLowerCase().includes(location.toLowerCase()) ||
      col.district.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (selectedCourses) {
    const arr = Array.isArray(selectedCourses) ? selectedCourses : [selectedCourses];
    filteredColleges = filteredColleges.filter(col => col.courses.some(c => arr.includes(c)));
  }

  if (selectedFacilities) {
    const arr = Array.isArray(selectedFacilities) ? selectedFacilities : [selectedFacilities];
    filteredColleges = filteredColleges.filter(col => col.facilities.some(f => arr.includes(f)));
  }
}

  let selectedCollege = null;
  if (selected) {
    selectedCollege = colleges.find(col => col.id.toString() === selected.toString());
  }

  res.render("colleges", {
    title: "Government Colleges - Career Advisor",
    colleges: filteredColleges,
    selectedCollege,
    req
  });
});

module.exports = router;
