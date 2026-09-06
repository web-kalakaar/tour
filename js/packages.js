/* ==========================================================================
   PACKAGES.JS
   JavaScript used only on the packages page:
   1. Scroll reveal for stop cards (shared logic, lives in main.js).
   2. A scroll-linked "road" fill that grows as the user scrolls through
      the itinerary section, visually connecting each day's stop.

   Depends on main.js loading first — uses KDT.setupScrollReveal and
   KDT.rafThrottle.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  KDT.setupScrollReveal(".reveal");
  setupJourneyRoad();
});

/* --------------------------------------------------------------------------
   SCROLL-LINKED JOURNEY ROAD
   As the user scrolls through #journeyTrack, the vertical gold line
   (#journeyRoadFill) grows from 0 to full height, connecting the day
   stops in sequence. The scroll handler is wrapped in KDT.rafThrottle
   so the fill only recalculates once per animation frame, not on every
   scroll event (which can fire dozens of times per frame on some devices).
   -------------------------------------------------------------------------- */
function setupJourneyRoad() {
  var track = document.getElementById("journeyTrack");
  var fill = document.getElementById("journeyRoadFill");
  if (!track || !fill) return;

  // If the user prefers reduced motion, show the road fully filled
  // instead of animating it on scroll.
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    fill.style.transform = "scaleY(1)";
    return;
  }

  var updateRoadFill = KDT.rafThrottle(function () {
    var rect = track.getBoundingClientRect();
    var viewportHeight = window.innerHeight;

    // Progress goes from 0 (section just entering the bottom of the
    // viewport) to 1 (section has fully scrolled past the top).
    var totalScrollDistance = rect.height + viewportHeight;
    var scrolled = viewportHeight - rect.top;
    var progress = scrolled / totalScrollDistance;

    progress = Math.max(0, Math.min(1, progress));
    fill.style.transform = "scaleY(" + progress + ")";
  });

  updateRoadFill();
  window.addEventListener("scroll", updateRoadFill, { passive: true });
  window.addEventListener("resize", updateRoadFill, { passive: true });
}
