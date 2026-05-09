// seed/seed.js
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const College = require("../models/College");
const Notification = require("../models/Notification");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/careerAdvisor";

const colleges = [
  { name: "Govt Degree College A", location: "Town A", courses: ["B.A", "B.Sc (Physics)", "B.Com"], cutoff: "50%", facilities: ["Hostel","Library"], contact: "0123-456" },
  { name: "Govt Degree College B", location: "Town B", courses: ["B.Sc (Maths)", "BCA", "BBA"], cutoff: "45%", facilities: ["Lab","Internet"], contact: "0456-789" }
];

const notifications = [
  { title: "Admissions Open - Govt College A", description: "Apply before 30 Sep", date: new Date("2025-09-30"), link: "#" },
  { title: "Scholarship Deadline", description: "State Scholarship - apply by 15 Oct", date: new Date("2025-10-15"), link: "#" }
];

async function seed() {
  try {
    await connectDB(MONGO_URI);
    await College.deleteMany({});
    await Notification.deleteMany({});
    await College.insertMany(colleges);
    await Notification.insertMany(notifications);
    console.log("Seeded DB");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
