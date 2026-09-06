/* ==========================================================================
   ABOUT.JS
   JavaScript used only on the about page: animated milestone counters.

   The counting-up logic itself lives once in main.js (KDT.setupCounterGroup /
   KDT.animateCounter) and is reused here — this file just points it at the
   right section and elements for this page.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  KDT.setupCounterGroup(".milestones", ".milestone-num");
});
