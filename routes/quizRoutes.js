
const express = require("express");
const User = require("../models/User");

const router = express.Router();

function isAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}


function recommendIntermediate(answers) {
  
  const scores = { MPC: 0, BIPC: 0, Commerce: 0, Arts: 0, Vocational: 0 };

  const likes = Array.isArray(answers.likes) ? answers.likes : (answers.likes ? [answers.likes] : []);

  
  likes.forEach(l => {
    if (l === "math" || l === "physics" || l === "chemistry") {
      scores.MPC += 3;
      scores.Commerce += (l === "math") ? 1 : 0; 
    }
    if (l === "biology") {
      scores.BIPC += 3;
      scores.Vocational += 1;
    }
    if (l === "accounts") {
      scores.Commerce += 3;
    }
    if (l === "history" || l === "arts") {
      scores.Arts += 3;
    }
    if (l === "arts") scores.Vocational += 1;
  });

  
  switch (answers.taskType) {
    case "problem": scores.MPC += 2; break;
    case "hands": scores.Vocational += 3; scores.MPC += 0; break;
    case "creative": scores.Arts += 3; break;
    case "business": scores.Commerce += 3; break;
    case "helping": scores.BIPC += 2; break;
  }

 
  switch (answers.strength) {
    case "analytical": scores.MPC += 2; scores.Commerce += 1; break;
    case "practical": scores.Vocational += 3; break;
    case "communicator": scores.Arts += 2; scores.Commerce += 1; break;
    case "creative": scores.Arts += 3; break;
    case "leader": scores.Commerce += 2; scores.MPC += 1; break;
  }

 
  switch (answers.longTerm) {
    case "job": scores.Vocational += 2; break;
    case "degree": scores.MPC += 1; scores.BIPC += 1; scores.Arts += 1; break;
    case "business": scores.Commerce += 2; break;
    case "service": scores.MPC += 1; scores.Vocational += 1; break;
  }

  
  if (answers.examOpenness === "yes") {
    scores.MPC += 1;
    scores.BIPC += 1;
    scores.Commerce += 1;
  } else if (answers.examOpenness === "no") {
    scores.Vocational += 2;
  }

  
  if (answers.prefIntermediate) {
    if (scores[answers.prefIntermediate] !== undefined) {
      scores[answers.prefIntermediate] += 3;
    }
  }

  
  const ordered = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const top = ordered[0][0]; 
  const second = ordered[1][0];

  
  const diff = ordered[0][1] - ordered[1][1];

  let chosen = top;
  if (diff <= 1 && answers.prefIntermediate) {
    chosen = answers.prefIntermediate;
  }

  return { chosenIntermediate: chosen, scores, ordered };
}

function mapAfter12(intermediate) {
  
  const mapping = {
    MPC: {
      description: "MPC keeps Engineering, Computer Science and related fields open.",
      degreeCourses: ["B.Tech / BE", "B.Sc (Physics/Maths/CS)", "BCA", "B.Stat"],
      careers: ["Engineer (Civil/Mech/CSE/ECE)", "Data Scientist/Analyst", "Software Developer", "Researcher"],
      entranceExams: ["JEE Main/Advanced", "State CETs", "BITSAT", "NDA (technical)"],
      advice: "If you like math and problem solving, choose MPC. Prepare for JEE / state CETs if aiming top engineering colleges."
    },
    BIPC: {
      description: "BiPC for Medicine, Pharmacy, Nursing, Biotechnology and allied health.",
      degreeCourses: ["MBBS", "B.Sc Nursing", "B.Pharm", "B.Sc (Biotech)"],
      careers: ["Doctor (MBBS)", "Pharmacist", "Researcher (Biotech)", "Nursing", "Lab Technician"],
      entranceExams: ["NEET-UG", "State MBBS entrance", "Pharmacy/Nursing entrances"],
      advice: "BiPC is suited for students passionate about biology and healthcare and willing to prepare for NEET."
    },
    Commerce: {
      description: "Commerce for Accounting, Finance, Business & Management.",
      degreeCourses: ["B.Com", "BBA", "CA (via CA Foundation)", "BMS"],
      careers: ["Accountant", "Business Analyst", "Banking", "Entrepreneur"],
      entranceExams: ["CA Foundation (or direct CA paths)", "CETs, CUET for colleges"],
      advice: "Good if you enjoy numbers, business and want commerce/management career paths."
    },
    Arts: {
      description: "Arts/Humanities for Social Sciences, Law, Journalism, Creative fields.",
      degreeCourses: ["B.A (Political Science, History, English)", "BA Journalism & Mass Comm", "BA LLB (integrated)"],
      careers: ["Lawyer (via CLAT later)", "Journalist", "Civil Services aspirant", "Content Creator"],
      entranceExams: ["CLAT (for integrated law)", "CUET, TISS, University exams"],
      advice: "Great for creativity, critical thinking, and fields in humanities and social sectors."
    },
    Vocational: {
      description: "Vocational / Diploma for job-ready skills and technical trades.",
      degreeCourses: ["Polytechnic Diploma", "ITI certificates", "Skill-based diplomas"],
      careers: ["Technician", "Mechanic", "Paramedical staff", "Skilled trades", "Direct jobs"],
      entranceExams: ["State technical admissions / direct college admissions"],
      advice: "Choose Vocational if you prefer practical skills and faster job entry; you can still pursue degree later via lateral entry."
    }
  };
  return mapping[intermediate] || mapping["Arts"];
}

router.get("/quiz", isAuth, (req, res) => {
  res.render("quiz", {
    title: "Career Quiz - Career Advisor",
    user: req.session.user || null
  });
});

router.post("/quiz", isAuth, async (req, res) => {
  try {
    
    const answers = {
      likes: req.body["likes[]"] || req.body.likes || req.body["likes"] || [],
      taskType: req.body.taskType,
      strength: req.body.strength,
      longTerm: req.body.longTerm,
      examOpenness: req.body.examOpenness,
      prefIntermediate: req.body.prefIntermediate
    };

    
    if (!Array.isArray(answers.likes)) {
      if (typeof answers.likes === "string" && answers.likes.length) {
        answers.likes = [answers.likes];
      } else {
        answers.likes = [];
      }
    }

    
    const intermediateResult = recommendIntermediate(answers);
    const chosen = intermediateResult.chosenIntermediate;
    const after12 = mapAfter12(chosen);

    
    const recommendations = {
      stream: chosen, 
      scores: intermediateResult.scores,
      courses: after12.degreeCourses,
      careers: after12.careers,
      exams: after12.entranceExams,
      explanation: after12.advice,
      generatedAt: new Date()
    };

    
    await User.findByIdAndUpdate(req.session.user._id, {
      quizResults: answers,
      recommendations
    });

    res.redirect("/recommendations");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


router.get("/recommendations", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("recommendations", {
      title: "Recommendations - Career Advisor",
      user,
      recommendations: user.recommendations || {}
    });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
});

module.exports = router;
