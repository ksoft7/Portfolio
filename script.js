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
