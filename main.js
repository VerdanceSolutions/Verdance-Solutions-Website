document.addEventListener("DOMContentLoaded", () => {
  // ========== MOBILE NAVIGATION TOGGLE ==========
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

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-item__question");
    const answer = item.querySelector(".faq-item__answer");
    if (!question || !answer) return;
    question.addEventListener("click", () => {
      const isOpen = item.classList.toggle("active");
      question.setAttribute("aria-expanded", isOpen ? "true" : "false");
      answer.hidden = !isOpen;
    });
  });

  // ========== CUSTOM SELECT DROPDOWNS (Country of Origin & Volume) ==========
  const KNOWN_COUNTRIES = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
    "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
    "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
    "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
    "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada",
    "Central African Republic","Chad","Chile","China","Colombia","Comoros",
    "Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba",
    "Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic",
    "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia",
    "Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
    "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
    "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran",
    "Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan",
    "Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
    "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar",
    "Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania",
    "Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro",
    "Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
    "New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia",
    "Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay",
    "Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
    "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
    "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal",
    "Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia",
    "Solomon Islands","Somalia","South Africa","South Korea","South Sudan",
    "Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
    "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga",
    "Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
    "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay",
    "Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
    "Zambia","Zimbabwe"
  ];
  const KNOWN_COUNTRIES_SET = new Set(KNOWN_COUNTRIES);

  const countryDropdown   = document.querySelector(".dropdown-select[data-target='country']");
  const countryOtherWrap  = document.getElementById("country-other-wrap");
  const countrySearchEl   = document.getElementById("country-other-search");
  const countrySuggestions = document.getElementById("country-suggestions");

  function initSelectDropdown(detailsEl) {
    if (!detailsEl) return;
    const summary     = detailsEl.querySelector("summary");
    const options     = detailsEl.querySelectorAll(".dropdown-select__option");
    const hiddenInput = document.getElementById(detailsEl.dataset.target);

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        const value = opt.dataset.value;
        const label = opt.textContent.trim();
        const labelEl = summary.querySelector(".dropdown-select__label");

        if (value === "Other" && detailsEl === countryDropdown) {
          if (labelEl) {
            labelEl.textContent = "Other\u2026";
            labelEl.classList.add("dropdown-select__label--selected");
          }
          options.forEach((o) => o.setAttribute("aria-selected", "false"));
          opt.setAttribute("aria-selected", "true");
          detailsEl.removeAttribute("open");
          if (countryOtherWrap) {
            countryOtherWrap.hidden = false;
            if (countrySearchEl) {
              countrySearchEl.value = "";
              countrySearchEl.focus();
            }
          }
          if (hiddenInput) {
            hiddenInput.value = "Other";
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return;
        }

        if (detailsEl === countryDropdown && countryOtherWrap) {
          countryOtherWrap.hidden = true;
          if (countrySearchEl) countrySearchEl.value = "";
          closeSuggestions();
        }

        if (labelEl) {
          labelEl.textContent = label;
          labelEl.classList.add("dropdown-select__label--selected");
        }
        if (hiddenInput) hiddenInput.value = value;
        options.forEach((o) => o.setAttribute("aria-selected", "false"));
        opt.setAttribute("aria-selected", "true");
        detailsEl.removeAttribute("open");
        if (hiddenInput) hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  document.querySelectorAll(".dropdown-select").forEach(initSelectDropdown);

  // ========== CUSTOM COUNTRY SUGGESTION PANEL ==========
  let activeSuggestionIndex = -1;

  function openSuggestions(matches) {
    if (!countrySuggestions || matches.length === 0) {
      closeSuggestions();
      return;
    }
    countrySuggestions.innerHTML = "";
    activeSuggestionIndex = -1;
    matches.forEach((country, idx) => {
      const li = document.createElement("li");
      li.className = "country-suggestion-item";
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.dataset.value = country;
      li.id = "country-suggestion-" + idx;
      li.textContent = country;
      li.addEventListener("mousedown", (e) => { e.preventDefault(); });
      li.addEventListener("click", () => { confirmCountry(country); });
      countrySuggestions.appendChild(li);
    });
    countrySuggestions.hidden = false;
    if (countrySearchEl) countrySearchEl.setAttribute("aria-expanded", "true");
  }

  function closeSuggestions() {
    if (!countrySuggestions) return;
    countrySuggestions.hidden = true;
    countrySuggestions.innerHTML = "";
    activeSuggestionIndex = -1;
    if (countrySearchEl) {
      countrySearchEl.setAttribute("aria-expanded", "false");
      countrySearchEl.removeAttribute("aria-activedescendant");
    }
  }

  function setActiveItem(index) {
    const items = countrySuggestions
      ? countrySuggestions.querySelectorAll(".country-suggestion-item")
      : [];
    items.forEach((item, i) => {
      const active = i === index;
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.classList.toggle("country-suggestion-item--active", active);
    });
    if (index >= 0 && items[index]) {
      countrySearchEl.setAttribute("aria-activedescendant", items[index].id);
      items[index].scrollIntoView({ block: "nearest" });
    } else {
      countrySearchEl.removeAttribute("aria-activedescendant");
    }
  }

  function confirmCountry(country) {
    const hiddenCountry  = document.getElementById("country");
    const summaryLabelEl = countryDropdown
      ? countryDropdown.querySelector(".dropdown-select__label")
      : null;
    if (countrySearchEl) countrySearchEl.value = country;
    if (hiddenCountry) {
      hiddenCountry.value = country;
      hiddenCountry.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (summaryLabelEl) summaryLabelEl.textContent = country;
    if (countryOtherWrap) countryOtherWrap.hidden = true;
    closeSuggestions();
  }

  if (countrySearchEl) {
    const hiddenCountry  = document.getElementById("country");
    const summaryLabelEl = countryDropdown
      ? countryDropdown.querySelector(".dropdown-select__label")
      : null;

    countrySearchEl.addEventListener("input", () => {
      const val = countrySearchEl.value.trim();
      if (!val) {
        closeSuggestions();
        if (hiddenCountry) {
          hiddenCountry.value = "Other";
          hiddenCountry.dispatchEvent(new Event("change", { bubbles: true }));
        }
        return;
      }
      const lower = val.toLowerCase();
      const matches = KNOWN_COUNTRIES.filter((c) => c.toLowerCase().startsWith(lower));
      openSuggestions(matches);
      if (hiddenCountry) {
        hiddenCountry.value = KNOWN_COUNTRIES_SET.has(val) ? val : "Other";
        hiddenCountry.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (summaryLabelEl && val) summaryLabelEl.textContent = val;
    });

    countrySearchEl.addEventListener("keydown", (e) => {
      const items = countrySuggestions
        ? countrySuggestions.querySelectorAll(".country-suggestion-item")
        : [];
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items.length === 0) return;
        activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, items.length - 1);
        setActiveItem(activeSuggestionIndex);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length === 0) return;
        activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
        setActiveItem(activeSuggestionIndex);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
          confirmCountry(items[activeSuggestionIndex].dataset.value);
        } else {
          const val = countrySearchEl.value.trim();
          if (KNOWN_COUNTRIES_SET.has(val)) confirmCountry(val);
          else closeSuggestions();
        }
        countrySearchEl.blur();
        return;
      }
      if (e.key === "Escape") { closeSuggestions(); return; }
    });

    countrySearchEl.addEventListener("blur", () => {
      setTimeout(() => {
        const val = countrySearchEl.value.trim();
        if (KNOWN_COUNTRIES_SET.has(val)) {
          if (hiddenCountry) {
            hiddenCountry.value = val;
            hiddenCountry.dispatchEvent(new Event("change", { bubbles: true }));
          }
          if (summaryLabelEl) summaryLabelEl.textContent = val;
          if (countryOtherWrap) countryOtherWrap.hidden = true;
        } else if (!val) {
          if (hiddenCountry) hiddenCountry.value = "";
          if (summaryLabelEl) {
            summaryLabelEl.textContent = "Select country";
            summaryLabelEl.classList.remove("dropdown-select__label--selected");
          }
          if (countryOtherWrap) countryOtherWrap.hidden = true;
        }
        closeSuggestions();
      }, 120);
    });
  }

  // ========== CLICK OUTSIDE — COLLAPSE ALL OPEN DROPDOWNS ==========
  document.addEventListener("mousedown", (e) => {
    document.querySelectorAll(".dropdown-multi[open], .dropdown-select[open]").forEach((dd) => {
      if (dd.contains(e.target)) return;
      dd.removeAttribute("open");
    });
    if (
      countrySuggestions &&
      !countrySuggestions.hidden &&
      countrySearchEl &&
      !countrySearchEl.contains(e.target) &&
      !countrySuggestions.contains(e.target)
    ) {
      closeSuggestions();
    }
  });

  // ========== PRODUCTS OTHER TOGGLE ==========
  const otherCheckbox    = document.getElementById("products-other-checkbox");
  const otherInputWrap   = document.getElementById("products-other-input-wrap");
  const otherInput       = document.getElementById("products-other-input");

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
    otherInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const dropdown = document.querySelector(".dropdown-multi");
        if (dropdown) dropdown.removeAttribute("open");
        otherInput.blur();
      }
    });
  }

  // ========== INDUSTRY OTHER TOGGLE ==========
  const industryOtherCheckbox  = document.getElementById("industry-other-checkbox");
  const industryOtherInputWrap = document.getElementById("industry-other-input-wrap");
  const industryOtherInput     = document.getElementById("industry-other-input");

  if (industryOtherCheckbox && industryOtherInputWrap && industryOtherInput) {
    industryOtherCheckbox.addEventListener("change", () => {
      industryOtherInputWrap.hidden = !industryOtherCheckbox.checked;
      if (industryOtherCheckbox.checked) {
        industryOtherInput.focus();
      } else {
        industryOtherInput.value = "";
        clearFieldError("industry-other-input");
      }
    });
    industryOtherInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const dropdown = document.getElementById("industry-dropdown");
        if (dropdown) dropdown.removeAttribute("open");
        industryOtherInput.blur();
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
      phoneEl.placeholder = hint ? hint.placeholder : "Include country code";
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
    if (remaining === 0) hideBanner();
    else {
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

  if (industryOtherInput) {
    industryOtherInput.addEventListener("input", () => {
      clearFieldError("industry-other-input");
      updateBannerAfterClear();
    });
  }

  document.querySelectorAll('input[name="products"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      clearProductsError();
      updateBannerAfterClear();
    });
  });

  // ========== FORM SUBMIT ==========
  const contactForm  = document.getElementById("contact__form");
  const successBlock = document.getElementById("form-success");
  const errorBlock   = document.getElementById("form-error");
  const submitBtn    = document.getElementById("form-submit-btn");

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

      let errorCount = 0;

      requiredFields.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          setFieldError(id, `${label} is required.`);
          errorCount++;
        }
      });

      const emailEl = document.getElementById("email");
      if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        setFieldError("email", "Please enter a valid email address.");
        errorCount++;
      }

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

      const checkedProducts = document.querySelectorAll('input[name="products"]:checked');
      if (checkedProducts.length === 0) {
        setProductsError("Please select at least one product.");
        errorCount++;
      }

      const otherChecked = document.getElementById("products-other-checkbox")?.checked;
      const otherValue   = document.getElementById("products-other-input")?.value.trim();
      if (otherChecked && !otherValue) {
        setFieldError("products-other-input", "Please specify the product.");
        errorCount++;
      }

      const industryOtherChecked = document.getElementById("industry-other-checkbox")?.checked;
      const industryOtherValue   = document.getElementById("industry-other-input")?.value.trim();
      if (industryOtherChecked && !industryOtherValue) {
        setFieldError("industry-other-input", "Please specify your industry.");
        errorCount++;
      }

      if (errorCount > 0) {
        const noun = errorCount === 1 ? "field needs" : "fields need";
        showBanner(`${errorCount} ${noun} attention before submitting.`);
        const firstError = contactForm.querySelector(".input--error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (validationBanner) {
          validationBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const titleEl   = document.getElementById("title");
      const companyEl = document.getElementById("company");
      const volumeEl  = document.getElementById("volume");

      if (titleEl && titleEl.classList.contains("input--autofilled") && !titleEl.value.trim()) titleEl.value = "No title";
      if (companyEl && companyEl.classList.contains("input--autofilled") && !companyEl.value.trim()) companyEl.value = "No company affiliation";
      if (volumeEl && !volumeEl.value) volumeEl.value = "Not specified";

      const API_URL = "https://verdance-server-production.up.railway.app/api/submit";

      const countryValue = (() => {
        if (countrySearchEl && !countryOtherWrap?.hidden) {
          const searched = countrySearchEl.value.trim();
          if (KNOWN_COUNTRIES_SET.has(searched)) return searched;
        }
        return countryEl ? countryEl.value : "";
      })();

      const products = Array.from(checkedProducts)
        .map((cb) => cb.value === "other" ? otherValue : cb.value)
        .join(";");

      const checkedIndustries = document.querySelectorAll('input[name="industry"]:checked');
      const industries = Array.from(checkedIndustries)
        .map((cb) => cb.value === "other" ? industryOtherValue : cb.value)
        .filter(Boolean)
        .join(";");

      const payload = {
        fullName:    document.getElementById("name").value,
        title:       titleEl   ? titleEl.value   : "",
        company:     companyEl ? companyEl.value : "",
        industry:    industries,
        email:       emailEl.value,
        phone:       phoneEl.value,
        volume:      volumeEl  ? volumeEl.value  : "",
        country:     countryValue,
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

  // ========== SMOOTH SCROLLING ==========
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
