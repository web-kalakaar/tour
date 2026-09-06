/* ==========================================================================
   FAQ.JS
   JavaScript used only on the FAQ page:
   1. Accordion open/close for each question.
   2. Category filtering via the category buttons.
   3. Automatic category question counts.
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setupAccordion();
  setupCategoryFilter();
  updateCategoryCounts();
});

/* --------------------------------------------------------------------------
   ACCORDION
   Only one answer remains open at a time.
   -------------------------------------------------------------------------- */

function setupAccordion() {
  var list = document.getElementById("faqList");

  if (!list) return;

  list.addEventListener("click", function (event) {
    var questionButton = event.target.closest(".faq-question");

    if (!questionButton) return;

    var item = questionButton.closest(".faq-item");

    if (!item) return;

    var isOpen = item.classList.contains("is-open");

    // Close all currently open items
    list.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
      openItem.classList.remove("is-open");

      var button = openItem.querySelector(".faq-question");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    // Open clicked item if it was previously closed
    if (!isOpen) {
      item.classList.add("is-open");
      questionButton.setAttribute("aria-expanded", "true");
    }
  });
}

/* --------------------------------------------------------------------------
   CATEGORY FILTER
   -------------------------------------------------------------------------- */

var activeCategory = "all";

function setupCategoryFilter() {
  var categoryBar = document.getElementById("faqCategories");

  if (!categoryBar) return;

  categoryBar.addEventListener("click", function (event) {
    var button = event.target.closest(".faq-cat-btn");

    if (!button) return;

    activeCategory = button.getAttribute("data-category");

    // Update active button
    categoryBar.querySelectorAll(".faq-cat-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn === button);
    });

    applyCategoryFilter();
  });
}

/* --------------------------------------------------------------------------
   CATEGORY FILTER LOGIC
   -------------------------------------------------------------------------- */

function applyCategoryFilter() {
  var items = document.querySelectorAll(".faq-item");

  items.forEach(function (item) {
    var itemCategory = item.getAttribute("data-category");

    var isVisible =
      activeCategory === "all" ||
      itemCategory === activeCategory;

    item.classList.toggle("is-filtered-out", !isVisible);

    // Close FAQ items that become hidden
    if (!isVisible) {
      item.classList.remove("is-open");

      var questionButton = item.querySelector(".faq-question");

      if (questionButton) {
        questionButton.setAttribute("aria-expanded", "false");
      }
    }
  });
}

/* --------------------------------------------------------------------------
   CATEGORY COUNTS
   Automatically calculates the number of FAQs in each category.
   -------------------------------------------------------------------------- */

function updateCategoryCounts() {
  var items = document.querySelectorAll(".faq-item");

  var counts = {
    all: items.length
  };

  items.forEach(function (item) {
    var category = item.getAttribute("data-category");

    if (!category) return;

    counts[category] = (counts[category] || 0) + 1;
  });

  document.querySelectorAll("[data-count-for]").forEach(function (badge) {
    var category = badge.getAttribute("data-count-for");

    badge.textContent = counts[category] || 0;
  });
}