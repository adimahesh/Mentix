// main.js - small UI helpers
document.addEventListener("DOMContentLoaded", ()=> {
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", () => {
      const btn = document.getElementById("quizSubmitBtn");
      if (btn) {
        btn.disabled = true;
        btn.innerText = "Submitting...";
      }
    });
  }
});
