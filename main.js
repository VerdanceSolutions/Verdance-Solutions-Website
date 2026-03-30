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

  function clearAllErrors() {
    document.querySelectorAll(".input--error").forEach((el) => el.classList.remove("input--error"));
    document.querySelectorAll(".field-error").forEach((el) => (el.hidden = true));
    hideBanner();
  }

  // ========== VALIDATION BANNER ==========
  const validationBanner = document.getElementById("form-validation-banner");

  function showBanner(errorCount) {
    if (!validationBanner) return;
    const noun = errorCount === 1 ? "field needs" : "fields need";
    validationBanner.textContent = `Please complete all required fields before submitting — ${errorCount} ${noun} attention.`;
    validationBanner.hidden = false;
  }

  function hideBanner() {
    if (!validationBanner) return;
    validationBanner.hidden = true;
  }

  // Clear inline error on input — also recounts and updates banner
  ["name", "title", "company", "email", "phone", "volume"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearFieldError(id));
  });

  // Clear products-other inline error when user types
  if (otherInput) {
    otherInput.addEventListener("input", () => clearFieldError("products-other-input"));
  }

  // ========== FORM SUCCESS SWAP (v1 Feature) ==========
  const contactForm = document.getElementById("contact__form");
  const successBlock = document.getElementById("form-success");
  const errorBlock = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit-btn");

  // Final Form Handler
  if (contactForm && successBlock) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearAllErrors();
      errorBlock.hidden = true;

      const requiredFields = [
        { id: "name",    label: "Full name" },
        { id: "title",   label: "Title" },
        { id: "company", label: "Company" },
        { id: "email",   label: "Email" },
        { id: "phone",   label: "Phone" },
        { id: "volume",  label: "Annual container volume" },
      ];

      let errorCount = 0;

      // Per-field empty check
      requiredFields.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          setFieldError(id, `${label} is required.`);
          errorCount++;
        }
      });

      // Email format check (only if not already flagged empty)
      const emailEl = document.getElementById("email");
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        setFieldError("email", "Please enter a valid email address.");
        errorCount++;
      }

      // Products check
      const checkedProducts = document.querySelectorAll('input[name="products"]:checked');
      const hasProduct = checkedProducts.length > 0;
      if (!hasProduct) {
        const summary = document.querySelector(".dropdown-multi summary");
        if (summary) {
          summary.classList.add("input--error");
          let hint = summary.parentElement.querySelector(".field-error");
          if (!hint) {
            hint = document.createElement("span");
            hint.className = "field-error";
            hint.setAttribute("role", "alert");
            summary.parentElement.appendChild(hint);
          }
          hint.textContent = "Please select at least one product.";
          hint.hidden = false;
        }
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
        showBanner(errorCount);
        // Scroll to the banner at the top of the form
        if (validationBanner) {
          validationBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const firstError = contactForm.querySelector(".input--error");
          if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Reset error state and set loading
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const API_URL =
        "https://verdance-server-production.up.railway.app/api/submit";

      const products = Array.from(checkedProducts)
        .map((cb) => cb.value === "other" ? `other: ${otherValue}` : cb.value)
        .join(";");

      const payload = {
        fullName: document.getElementById("name").value,
        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        volume: document.getElementById("volume").value,
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

        // UI success swap
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

  // ========== SMOOTH SCROLLING FOR ANCHOR LINKS (v2 Feature) ==========
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
