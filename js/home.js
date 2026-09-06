/* ==========================================================================
   HOME.JS
   JavaScript used only on the homepage: hero background slider,
   animated stat counters in the About section.

   Depends on main.js loading first — uses KDT.setupCounterGroup.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setupHeroSlider();
  KDT.setupCounterGroup("#about", ".about-stat-num");
});

/* --------------------------------------------------------------------------
   HERO SLIDER — auto-rotating background images with dot navigation
   -------------------------------------------------------------------------- */
function setupHeroSlider() {
  var slidesWrap = document.getElementById("heroSlides");
  var dotsWrap = document.getElementById("heroDots");
  if (!slidesWrap || !dotsWrap) return;

  var slides = slidesWrap.querySelectorAll(".hero-slide");
  if (slides.length === 0) return;

  var currentIndex = 0;
  var slideDuration = 5000;
  var timer = null;

  // Build one dot button per slide, using a fragment so the DOM is
  // touched once instead of once per slide.
  var fragment = document.createDocumentFragment();

  slides.forEach(function (slide, index) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-dot" + (index === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Show slide " + (index + 1));

    dot.addEventListener("click", function () {
      goToSlide(index);
      restartTimer();
    });

    fragment.appendChild(dot);
  });

  dotsWrap.appendChild(fragment);
  var dots = dotsWrap.querySelectorAll(".hero-dot");

  function goToSlide(index) {
    slides[currentIndex].classList.remove("is-active");
    dots[currentIndex].classList.remove("is-active");

    currentIndex = index;

    slides[currentIndex].classList.add("is-active");
    dots[currentIndex].classList.add("is-active");
  }

  function goToNextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function startTimer() {
    // Don't auto-rotate for users who've asked for reduced motion.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timer = setInterval(goToNextSlide, slideDuration);
  }

  function restartTimer() {
    clearInterval(timer);
    startTimer();
  }

  startTimer();

  // Pause rotation while the tab is hidden, so it doesn't burn cycles
  // or jump multiple slides when the user comes back.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      startTimer();
    }
  });
}
