const express = require("express");
const router = express.Router();

router.get("/postDegreeOptions", (req, res) => {
  res.render("postDegreeOptions", { title: "Post-Degree Options" });
});

module.exports = router;
