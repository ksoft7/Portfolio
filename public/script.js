"use strict";

// Skill function
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");
  const progressTexts = document.querySelectorAll(".progress-text");

  progressBars.forEach((bar, index) => {
    const value = parseInt(progressTexts[index].getAttribute("data-value"));
    const startOffset = 314;
    const targetOffset = startOffset - (startOffset * value) / 100;
    const duration = 2500;
    let startTime = null;

    function updateAnimation(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const currentValue = Math.round(progress * value);
      const currentOffset =
        startOffset - progress * (startOffset - targetOffset);

      progressTexts[index].textContent = `${currentValue}%`;
      bar.style.strokeDashoffset = currentOffset;

      if (progress < 1) {
        requestAnimationFrame(updateAnimation);
      }
    }

    requestAnimationFrame(updateAnimation);
  });
}

const skillsSection = document.querySelector(".container");
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgressBars();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(skillsSection);

// email sender

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneNumberInput = document.getElementById("telphone");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const submitBtn = document.querySelector(".submitBtn");

  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    phoneNumber: phoneNumberInput.value,
    subject: subjectInput.value,
    message: messageInput.value,
  };

  const messageContainer = document.querySelector(".messageContainer");
  messageContainer.style.marginTop = "10px";
  messageContainer.style.fontWeight = "bold";

  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      messageContainer.textContent = "✅ Message sent successfully";
      messageContainer.style.color = "green";

      nameInput.value = "";
      emailInput.value = "";
      phoneNumberInput.value = "";
      subjectInput.value = "";
      messageInput.value = "";
    } else {
      const errorData = await response.json(); // ⬅️ Read error response
      messageContainer.textContent = `❌ ${
        errorData.message || "Failed to send message."
      }`;
      messageContainer.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    messageContainer.textContent = "❌ Network error. Please try again.";
    messageContainer.style.color = "red";
  }

  submitBtn.textContent = "Sent";
  submitBtn.disabled = false;
});
