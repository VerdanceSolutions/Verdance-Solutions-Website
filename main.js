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

  // ========== FORM SUCCESS SWAP (v1 Feature) ==========
  const contactForm = document.getElementById("contact__form");
  const successBlock = document.getElementById("form-success");
  const errorBlock = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit-btn");

  // Final Form Handler
  if (contactForm && successBlock) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const requiredFields = ["name", "email", "company", "message"];
      const isEmpty = requiredFields.some(
        (id) => !document.getElementById(id).value.trim(),
      );
      if (isEmpty) {
        return;
      }

      // Reset error state and set loading
      errorBlock.hidden = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      // const API_URL =
      //   "https://verdance-server-production.up.railway.app/api/submit";
      const API_URL = "https://httpstat.us/500";

      const products = Array.from(
        document.querySelectorAll('input[name="products"]:checked'),
      )
        .map((cb) => cb.value)
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
  // SMOOTH SCROLLING FOR ANCHOR LINKS v2
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  if (anchorLinks && anchorLinks.length) {
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        // Use the event's currentTarget (the anchor element), not `this`
        const href = e.currentTarget.getAttribute("href");

        // Ignore empty hashes
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }
});
