/* ==========================================================================
   MAIN.JS
   Common JavaScript used on every page: loader, navbar (scroll state,
   mobile menu, dropdowns), scroll progress bar, back-to-top button.
   Also exposes small shared utilities (KDT namespace) that other
   page-specific files reuse, so logic like "animate a number counting
   up" is written once instead of copy-pasted per page.

   Keep this file page-agnostic — nothing homepage-specific goes here.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   SHARED UTILITIES — reused by home.js, about.js, packages.js, etc.
   -------------------------------------------------------------------------- */
window.KDT = window.KDT || {};

/**
 * Runs a callback at most once per animation frame, no matter how many
 * times it's called in between. Use this to wrap scroll/resize handlers
 * so they don't run 50+ times a second on fast scrolling or mobile.
 * @param {Function} callback
 * @returns {Function} throttled version of callback
 */
KDT.rafThrottle = function (callback) {
  var isScheduled = false;

  return function () {
    if (isScheduled) return;
    isScheduled = true;

    requestAnimationFrame(function () {
      callback();
      isScheduled = false;
    });
  };
};

/**
 * Animates a number counting up from 0 to the value in the element's
 * data-count attribute. Used for the homepage "About" stats and the
 * About page "Milestones" stats — same visual effect, one implementation.
 * @param {HTMLElement} counterEl - element with a data-count attribute
 * @param {number} [duration=1500] - animation length in milliseconds
 */
KDT.animateCounter = function (counterEl, duration) {
  var target = parseInt(counterEl.getAttribute("data-count"), 10);
  if (isNaN(target)) return;

  duration = duration || 1500;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    counterEl.textContent = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      counterEl.textContent = target;
    }
  }

  requestAnimationFrame(step);
};

/**
 * Watches a trigger section and, the first time it scrolls into view,
 * animates every counter element inside it. Runs once per page load.
 * @param {string} triggerSelector - selector for the section to watch
 * @param {string} counterSelector - selector for the .data-count elements
 */
KDT.setupCounterGroup = function (triggerSelector, counterSelector) {
  var triggerEl = document.querySelector(triggerSelector);
  var counters = document.querySelectorAll(counterSelector);
  if (!triggerEl || counters.length === 0) return;

  var hasAnimated = false;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(function (counter) { KDT.animateCounter(counter); });
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(triggerEl);
};

/**
 * Fades/rises elements into view the first time they scroll into the
 * viewport. Expects elements to carry a "reveal" class already styled
 * in CSS (opacity: 0 by default, .is-visible sets opacity: 1).
 * @param {string} [selector=".reveal"]
 */
KDT.setupScrollReveal = function (selector) {
  var items = document.querySelectorAll(selector || ".reveal");
  if (items.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  });

  items.forEach(function (item) { observer.observe(item); });
};

/* --------------------------------------------------------------------------
   PAGE INIT
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  hideLoaderWhenReady();
  setupNavbarScrollState();
  setupMobileMenu();
  setupDropdowns();
  setupScrollProgress();
  setupBackToTop();
  setFooterYear();
});

/* --------------------------------------------------------------------------
   LOADER — hide once the page has fully loaded
   -------------------------------------------------------------------------- */
function hideLoaderWhenReady() {
  var loader = document.getElementById("loader");
  if (!loader) return;

  window.addEventListener("load", function () {
    setTimeout(function () {
      loader.classList.add("is-hidden");
    }, 400);
  });
}

/* --------------------------------------------------------------------------
   NAVBAR — add a shadow once the page is scrolled
   -------------------------------------------------------------------------- */
function setupNavbarScrollState() {
  var navbar = document.getElementById("navbar");
  if (!navbar) return;

  var updateNavbarState = KDT.rafThrottle(function () {
    navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  });

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });
}

/* --------------------------------------------------------------------------
   MOBILE MENU — hamburger toggle
   -------------------------------------------------------------------------- */
function setupMobileMenu() {
  var toggle = document.getElementById("navbarToggle");
  var nav = document.getElementById("navbarNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* --------------------------------------------------------------------------
   DROPDOWNS — click to open on mobile/tap devices. Desktop hover is
   handled entirely in CSS, so this only needs to run for tap/keyboard.
   -------------------------------------------------------------------------- */
function setupDropdowns() {
  var dropdowns = document.querySelectorAll(".navbar-dropdown");
  if (dropdowns.length === 0) return;

  dropdowns.forEach(function (dropdown) {
    var button = dropdown.querySelector(".navbar-dropdown-toggle");
    if (!button) return;

    button.addEventListener("click", function () {
      var isOpen = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");

      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("is-open");
          var otherButton = other.querySelector(".navbar-dropdown-toggle");
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   SCROLL PROGRESS BAR — fills as the user scrolls down the page
   -------------------------------------------------------------------------- */
function setupScrollProgress() {
  var bar = document.getElementById("scrollProgress");
  if (!bar) return;

  var updateProgress = KDT.rafThrottle(function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + "%";
  });

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function setupBackToTop() {
  var button = document.getElementById("backToTop");
  if (!button) return;

  var toggleVisibility = KDT.rafThrottle(function () {
    button.classList.toggle("is-visible", window.scrollY > 500);
  });

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   FOOTER YEAR — auto-update copyright year
   -------------------------------------------------------------------------- */
function setFooterYear() {
  var yearEl = document.getElementById("footerYear");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}
