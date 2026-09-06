/* ==========================================================================
   CONTACT.JS
   JavaScript used only on the contact page:
   1. Pre-fills the "Tour Interest" dropdown if the page was linked with
      a ?package= query string (e.g. from the pricing cards on packages.html).
   2. Simple client-side validation for required fields.
   3. A static, simulated form submission — replace the marked block with
      a real EmailJS call when you're ready to send actual emails (see the
      comment above the <form> in contact.html for exact steps).
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  prefillPackageFromUrl();
  setupFormValidation();
});

/* --------------------------------------------------------------------------
   PRE-FILL FROM URL
   Pricing cards on packages.html link here as contact.html?package=comfort.
   This matches that value against the dropdown options so the visitor
   doesn't have to re-select what they already told us.
   -------------------------------------------------------------------------- */
function prefillPackageFromUrl() {
  var params = new URLSearchParams(window.location.search);
  var packageParam = params.get("package");
  if (!packageParam) return;

  var select = document.getElementById("tourInterest");
  if (!select) return;

  var normalized = packageParam.toLowerCase();

  Array.prototype.forEach.call(select.options, function (option) {
    if (option.value.toLowerCase().indexOf(normalized) !== -1) {
      select.value = option.value;
    }
  });
}

/* --------------------------------------------------------------------------
   FORM VALIDATION + SUBMISSION
   -------------------------------------------------------------------------- */
function setupFormValidation() {
  var form = document.getElementById("enquiryForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = validateForm(form);
    if (!isValid) return;

    handleFormSubmit(form);
  });

  // Clear a field's error message as soon as the visitor starts fixing it.
  form.addEventListener("input", function (event) {
    clearFieldError(event.target);
  });
}

/**
 * Checks every required field and shows an inline error message under
 * any that are empty or invalid. Returns true only if everything passes.
 */
function validateForm(form) {
  var isValid = true;

  var requiredFields = [
    { id: "fromName", message: "Please enter your name." },
    { id: "fromPhone", message: "Please enter a phone number." },
    { id: "fromEmail", message: "Please enter a valid email address." },
    { id: "message", message: "Please add a short message." }
  ];

  requiredFields.forEach(function (field) {
    var input = document.getElementById(field.id);
    if (!input) return;

    var value = input.value.trim();
    var fieldIsValid = value !== "" && input.checkValidity();

    if (!fieldIsValid) {
      showFieldError(input, field.message);
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(input, message) {
  var errorEl = document.querySelector('[data-error-for="' + input.id + '"]');
  if (errorEl) errorEl.textContent = message;
  input.style.borderColor = "var(--color-error)";
}

function clearFieldError(input) {
  var errorEl = document.querySelector('[data-error-for="' + input.id + '"]');
  if (errorEl) errorEl.textContent = "";
  input.style.borderColor = "";
}

/**
 * Handles a validated form submission. Currently simulated (no email is
 * actually sent) — swap the block marked below for a real EmailJS call
 * once the account/service/template are set up. See the integration
 * note above the <form> tag in contact.html for the exact snippet.
 */
function handleFormSubmit(form) {
  var submitButton = form.querySelector(".contact-submit");
  var buttonText = submitButton.querySelector(".btn-text");

  submitButton.disabled = true;
  buttonText.textContent = "Sending...";

  // ---- SIMULATED SUBMISSION (replace with real EmailJS call later) ----
  setTimeout(function () {
    showSuccessState(form);
  }, 900);
  // -----------------------------------------------------------------
}

function showSuccessState(form) {
  var successEl = document.getElementById("contactSuccess");
  if (!successEl) return;

  form.hidden = true;
  successEl.hidden = false;
  successEl.scrollIntoView({ behavior: "smooth", block: "center" });
}
