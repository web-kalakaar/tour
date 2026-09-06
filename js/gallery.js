/* ==========================================================================
   GALLERY.JS
   JavaScript used only on the gallery page:
   1. Category filtering for the main masonry grid (All / Beawar / Heritage
      / Desert / Culture).
   2. A lightbox for viewing any gallery image full-size, with keyboard
      and button navigation between images.

   Depends on main.js loading first — uses KDT.setupScrollReveal.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  KDT.setupScrollReveal(".reveal");
  setupFilterBar();
  setupLightbox();
});

/* --------------------------------------------------------------------------
   FILTER BAR
   Each masonry item carries a space-separated data-category list (e.g.
   "beawar heritage"). Clicking a filter button shows only items whose
   category list includes the selected value, or everything for "all".
   -------------------------------------------------------------------------- */
function setupFilterBar() {
  var filterBar = document.getElementById("filterBar");
  var grid = document.getElementById("masonryGrid");
  if (!filterBar || !grid) return;

  var buttons = filterBar.querySelectorAll(".filter-btn");
  var items = grid.querySelectorAll(".masonry-item");

  filterBar.addEventListener("click", function (event) {
    var button = event.target.closest(".filter-btn");
    if (!button) return;

    var selected = button.getAttribute("data-filter");
    applyFilter(selected);
    setActiveButton(button);
  });

  function applyFilter(filterValue) {
    items.forEach(function (item) {
      var categories = (item.getAttribute("data-category") || "").split(" ");
      var matches = filterValue === "all" || categories.indexOf(filterValue) !== -1;
      item.classList.toggle("is-filtered-out", !matches);
    });
  }

  function setActiveButton(activeButton) {
    buttons.forEach(function (button) {
      var isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }
}

/* --------------------------------------------------------------------------
   LIGHTBOX
   Works for any image group on the page: pass a container and an item
   selector, and clicking an item within it opens the lightbox with
   next/previous navigation scoped to that same group.
   -------------------------------------------------------------------------- */
function setupLightbox() {
  var lightbox = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightboxImage");
  var closeButton = document.getElementById("lightboxClose");
  var prevButton = document.getElementById("lightboxPrev");
  var nextButton = document.getElementById("lightboxNext");
  if (!lightbox || !lightboxImage) return;

  var currentGroup = [];
  var currentIndex = 0;

  // Every image inside the main masonry grid opens the lightbox,
  // scoped to whichever images are currently visible under the active filter.
  bindGroup("#masonryGrid .masonry-item:not(.is-filtered-out) img");

  // Featured Beawar section images open the lightbox scoped to that section.
  bindGroup(".featured-item img");

  function bindGroup(selector) {
    document.addEventListener("click", function (event) {
      var image = event.target.closest(selector);
      if (!image) return;

      event.preventDefault();
      currentGroup = Array.prototype.slice.call(document.querySelectorAll(selector));
      currentIndex = currentGroup.indexOf(image);
      openLightbox();
    });
  }

  function openLightbox() {
    if (currentGroup.length === 0) return;
    updateImage();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateImage() {
    var image = currentGroup[currentIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt || "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    updateImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    updateImage();
  }

  closeButton.addEventListener("click", closeLightbox);
  nextButton.addEventListener("click", showNext);
  prevButton.addEventListener("click", showPrev);

  // Click outside the image (on the dark backdrop) also closes it.
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showNext();
    if (event.key === "ArrowLeft") showPrev();
  });
}
