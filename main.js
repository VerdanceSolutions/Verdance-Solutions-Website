document.addEventListener("DOMContentLoaded", () => {
  // ========== MOBILE NAVIGATION TOGGLE (BEM header) ==========
  const navToggle = document.querySelector(".navbar__toggle");
  const navLinks = document.querySelector(".navbar__links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("navbar__links--open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("navbar__links--open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ========== FAQ ACCORDION (v2 Feature) ==========
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-item__question");
    const answer = item.querySelector(".faq-item__answer");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.toggle("active");
      question.setAttribute("aria-expanded", isOpen ? "true" : "false");
      answer.hidden = !isOpen;
    });
  });

  // ========== PRODUCTS OTHER TOGGLE ==========
  const otherCheckbox = document.getElementById("products-other-checkbox");
  const otherInputWrap = document.getElementById("products-other-input-wrap");
  const otherInput = document.getElementById("products-other-input");

  if (otherCheckbox && otherInputWrap && otherInput) {
    otherCheckbox.addEventListener("change", () => {
      otherInputWrap.hidden = !otherCheckbox.checked;
      if (otherCheckbox.checked) {
        otherInput.focus();
      } else {
        otherInput.value = "";
        clearFieldError("products-other-input");
      }
    });

    // Enter in the other input collapses the dropdown instead of submitting
    otherInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const dropdown = document.querySelector(".dropdown-multi");
        if (dropdown) dropdown.removeAttribute("open");
        otherInput.blur();
      }
    });
  }

  // ========== OPTIONAL FIELD AUTOFILL ON BLUR ==========
  const OPTIONAL_AUTOFILL = [
    { id: "title",   fallback: "No title" },
    { id: "company", fallback: "No company affiliation" },
  ];

  OPTIONAL_AUTOFILL.forEach(({ id, fallback }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => {
      if (!el.value.trim()) {
        el.value = fallback;
        el.classList.add("input--autofilled");
      }
    });
    el.addEventListener("focus", () => {
      if (el.classList.contains("input--autofilled")) {
        el.value = "";
        el.classList.remove("input--autofilled");
      }
    });
  });

  // ========== COUNTRY-DRIVEN PHONE PLACEHOLDER ==========
  const PHONE_HINTS = {
    "United States": { placeholder: "(555) 555-5555", exact: 10 },
    "Canada":        { placeholder: "(555) 555-5555", exact: 10 },
    "Mexico":        { placeholder: "55 5555 5555",   exact: 10 },
    "Other":         { placeholder: "Include country code", exact: null },
  };

  const countryEl = document.getElementById("country");
  const phoneEl   = document.getElementById("phone");

  if (countryEl && phoneEl) {
    countryEl.addEventListener("change", () => {
      const hint = PHONE_HINTS[countryEl.value];
      if (hint) {
        phoneEl.placeholder = hint.placeholder;
      } else {
        phoneEl.placeholder = "";
      }
    });
  }

  // ========== INLINE VALIDATION HELPERS ==========
  function setFieldError(id, message) {
    const field = document.getElementById(id);
    if (!field) return;
    field.classList.add("input--error");
    let hint = field.parentElement.querySelector(".field-error");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "field-error";
      hint.setAttribute("role", "alert");
      field.parentElement.appendChild(hint);
    }
    hint.textContent = message;
    hint.hidden = false;
  }

  function clearFieldError(id) {
    const field = document.getElementById(id);
    if (!field) return;
    field.classList.remove("input--error");
    const hint = field.parentElement.querySelector(".field-error");
    if (hint) hint.hidden = true;
  }

  // Products dropdown uses <summary> instead of an input — separate helpers
  function setProductsError(message) {
    const details = document.querySelector(".dropdown-multi");
    const summary = details ? details.querySelector("summary") : null;
    if (!summary) return;
    summary.classList.add("input--error");
    let hint = details.querySelector(".field-error");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "field-error";
      hint.setAttribute("role", "alert");
      details.appendChild(hint);
    }
    hint.textContent = message;
    hint.hidden = false;
  }

  function clearProductsError() {
    const details = document.querySelector(".dropdown-multi");
    const summary = details ? details.querySelector("summary") : null;
    if (summary) summary.classList.remove("input--error");
    const hint = details ? details.querySelector(".field-error") : null;
    if (hint) hint.hidden = true;
  }

  function clearAllErrors() {
    document.querySelectorAll(".input--error").forEach((el) => el.classList.remove("input--error"));
    document.querySelectorAll(".field-error").forEach((el) => (el.hidden = true));
    hideBanner();
  }

  // ========== VALIDATION BANNER ==========
  const validationBanner = document.getElementById("form-validation-banner");

  function showBanner(message) {
    if (!validationBanner) return;
    validationBanner.textContent = message;
    validationBanner.hidden = false;
  }

  function hideBanner() {
    if (!validationBanner) return;
    validationBanner.hidden = true;
  }

  // ========== LIVE ERROR CLEAR ON INPUT ==========
  function getRemainingErrorCount() {
    return document.querySelectorAll(".field-error:not([hidden])").length;
  }

  function updateBannerAfterClear() {
    const remaining = getRemainingErrorCount();
    if (remaining === 0) {
      hideBanner();
    } else {
      const noun = remaining === 1 ? "field needs" : "fields need";
      showBanner(`${remaining} ${noun} attention before submitting.`);
    }
  }

  ["name", "email", "phone"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        clearFieldError(id);
        updateBannerAfterClear();
      });
    }
  });

  if (otherInput) {
    otherInput.addEventListener("input", () => {
      clearFieldError("products-other-input");
      updateBannerAfterClear();
    });
  }

  // Clear products error when any product checkbox changes
  document.querySelectorAll('input[name="products"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      clearProductsError();
      updateBannerAfterClear();
    });
  });

  // ========== FORM SUCCESS SWAP ==========
  const contactForm = document.getElementById("contact__form");
  const successBlock = document.getElementById("form-success");
  const errorBlock = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit-btn");

  if (contactForm && successBlock) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearAllErrors();
      errorBlock.hidden = true;

      const requiredFields = [
        { id: "name",  label: "Full name" },
        { id: "email", label: "Email" },
        { id: "phone", label: "Phone" },
      ];

      // Blank form check — only required fields + products
      const allEmpty = requiredFields.every(({ id }) => {
        const el = document.getElementById(id);
        return !el || !el.value.trim();
      });
      const checkedProducts = document.querySelectorAll('input[name="products"]:checked');
      const formIsBlank = allEmpty && checkedProducts.length === 0;

      if (formIsBlank) {
        showBanner("Please fill out the form to submit a request.");
        if (validationBanner) {
          validationBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      let errorCount = 0;

      // Per-field empty check
      requiredFields.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          setFieldError(id, `${label} is required.`);
          errorCount++;
        }
      });

      // Email format check
      const emailEl = document.getElementById("email");
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        setFieldError("email", "Please enter a valid email address.");
        errorCount++;
      }

      // Phone format check — digit count varies by country
      const phoneElVal = phoneEl ? phoneEl.value.trim() : "";
      if (phoneElVal) {
        const digits = phoneElVal.replace(/\D/g, "");
        const selectedCountry = countryEl ? countryEl.value : "";
        const hint = PHONE_HINTS[selectedCountry];
        const isInvalid = hint?.exact
          ? digits.length !== hint.exact
          : digits.length < 7 || digits.length > 15;
        if (isInvalid) {
          setFieldError("phone", "Please enter a valid phone number.");
          errorCount++;
        }
      }

      // Products check
      const hasProduct = checkedProducts.length > 0;
      if (!hasProduct) {
        setProductsError("Please select at least one product.");
        errorCount++;
      }

      // "Other" text check
      const otherChecked = document.getElementById("products-other-checkbox")?.checked;
      const otherValue = document.getElementById("products-other-input")?.value.trim();
      const otherInvalid = otherChecked && !otherValue;
      if (otherInvalid) {
        setFieldError("products-other-input", "Please specify the product.");
        errorCount++;
      }

      if (errorCount > 0) {
        const noun = errorCount === 1 ? "field needs" : "fields need";
        showBanner(`${errorCount} ${noun} attention before submitting.`);
        if (validationBanner) {
          validationBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const firstError = contactForm.querySelector(".input--error");
          if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // All good — lock the button and submit
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // Silent fills for optional fields
      const titleEl   = document.getElementById("title");
      const companyEl = document.getElementById("company");
      const volumeEl  = document.getElementById("volume");

      if (titleEl && titleEl.classList.contains("input--autofilled") && !titleEl.value.trim()) {
        titleEl.value = "No title";
      }
      if (companyEl && companyEl.classList.contains("input--autofilled") && !companyEl.value.trim()) {
        companyEl.value = "No company affiliation";
      }
      if (volumeEl && !volumeEl.value) {
        volumeEl.value = "Not specified";
      }

      const API_URL = "https://verdance-server-production.up.railway.app/api/submit";

      const products = Array.from(checkedProducts)
        .map((cb) => cb.value === "other" ? otherValue : cb.value)
        .join(";");

      const payload = {
        fullName:    document.getElementById("name").value,
        title:       titleEl ? titleEl.value : "",
        company:     companyEl ? companyEl.value : "",
        email:       emailEl.value,
        phone:       phoneEl.value,
        volume:      volumeEl ? volumeEl.value : "",
        country:     countryEl ? countryEl.value : "",
        description: document.getElementById("message").value,
        products,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          console.error("Submit failed:", await response.text());
          throw new Error("Server error");
        }

        contactForm.style.display = "none";
        successBlock.style.display = "block";
        successBlock.hidden = false;
        successBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        console.error("Network error:", err);
        errorBlock.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Request Briefing";
      }
    });
  }

  // ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  if (anchorLinks && anchorLinks.length) {
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = e.currentTarget.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
});
