require("dotenv").config(); 

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const careerpaths = require("./routes/careerRoutes");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const postDegreeRoutes = require("./routes/postDegreeRoutes");


const app = express();
const chatbotRoute = require("./routes/chatbot");


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/careerAdvisor";


connectDB(MONGO_URI);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/public", express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: process.env.SESSION_SECRET || "career_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  })
);


app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", quizRoutes);
app.use("/", careerpaths);
app.use("/", postDegreeRoutes);
app.use("/chatbot", chatbotRoute);
app.use("/colleges", collegeRoutes);

app.get("/", (req, res) => {
  res.render("home", { 
    title: "Home", 
    user: req.session.user || null 
  });
});


app.get("/signup", (req, res) => {
  res.render("signup", { 
    title: "Sign Up", 
    user: req.session.user || null 
  });
});


app.get("/login", (req, res) => {
  res.render("login", { 
    title: "Login", 
    user: req.session.user || null 
  });
});


app.use((req, res) => {
  res.status(404).render("404");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running http://localhost:${PORT}`));
module.exports = app;