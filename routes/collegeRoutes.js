const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Load college data from JSON file
const collegesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/college-list.json"), "utf-8")
);

router.get("/", (req, res) => {
  const { location, selected } = req.query;

  let colleges = [];
  let selectedCollege = null;

  if (location && location.trim() !== "") {
    const query = location.trim().toLowerCase();
    colleges = collegesData.filter(
      (col) =>
        col["District Name"]?.toLowerCase().includes(query) ||
        col["State Name"]?.toLowerCase().includes(query)
    );
  }

  if (selected) {
    selectedCollege =
      colleges.find((col) => col["College Name"] === selected) || null;
  }

  res.render("colleges", {
    colleges,
    selectedCollege,
    location: location || "",
  });
});

module.exports = router;