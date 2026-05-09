require("dotenv").config();

const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        reply: "No message received.",
      });
    }

    const chatCompletion =
      await groq.chat.completions.create({

        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI career mentor that suggests career paths, skills, and roadmaps.",
          },
          {
            role: "user",
            content: message,
          },
        ],

        model: "llama-3.3-70b-versatile",

      });

    const reply =
      chatCompletion.choices[0].message.content;

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (err) {

    console.error("Groq Error:", err);

    res.status(500).json({
      success: false,
      reply: "Error contacting AI service.",
    });
  }
});

module.exports = router;