const express = require("express");
const router = express.Router();


router.get("/careerPaths", (req, res) => {
  res.render("careerPaths", { title: "Career Paths" });
});


router.get("/careerPaths/:id", (req, res) => {
  const careerId = req.params.id;

  const careers = {
    engineering: { title: "Engineering", image: "career_engineering.jpg" },
    medical: { title: "Medical", image: "MBBS.jpg" },
    commerce: { title: "CA", image: "CA.jpg" },
    arts: { title: "Arts & Humanities", image: "IASofficer.jpg" },
    defence: { title: "Defence", image: "DEFENCE.jpg" },
    fashion: {title:"Fashion Designing",image:"fashion.jpg"},
    Policeofficer:{title:"Police officer",image:"policeofficer.jpg"},
    Teacher:{title:"Teacher",image:"teacher.jpg"},
    Defence:{title:"Defense",image:"DEFENCE.jpg"}
  };

  const career = careers[careerId];
  if (!career) return res.status(404).send("Career path not found");

  res.render("careerDetail", { title: career.title, image: career.image });
});

module.exports = router;
