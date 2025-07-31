"use strict";

// Scroll into view actions

function scrollIntoView(elementIdOrSelector) {
  // Normalize input: if no "#" prefix, assume it's an ID
  const selector = elementIdOrSelector.startsWith("#")
    ? elementIdOrSelector
    : `#${elementIdOrSelector}`;

  const element = document.querySelector(selector);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  } else {
    console.warn("Element not found:", selector);
  }
}

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

const skillsSection = document.querySelector(".skills");
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

const hamburger = document.querySelector(".ham");
const mobileSidebar = document.getElementById("mobileSidebar");
const closeBtn = document.getElementById("closeBtn");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
  mobileSidebar.classList.add("open");
  overlay.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  closeSidebar();
});

function closeSidebar() {
  mobileSidebar.classList.remove("open");
  overlay.style.display = "none";
}
