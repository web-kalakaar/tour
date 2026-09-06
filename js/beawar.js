/* ==========================================================================
   BEAWAR.JS
   JavaScript used only on the Beawar history page: scroll-triggered
   reveal animation for sections, timeline items, gate cards, and place
   cards. The reveal logic itself lives once in main.js (KDT.setupScrollReveal)
   — this file just calls it.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  KDT.setupScrollReveal(".reveal");
});
