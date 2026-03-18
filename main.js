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

  if (contactForm && successBlock) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Hide form and show success message
      contactForm.style.display = "none";
      successBlock.style.display = "block";

      // Smooth scroll into view for mobile clarity
      successBlock.scrollIntoView({ behavior: "smooth", block: "start" });

      // Optional: Reset form after display
      // contactForm.reset();
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

  const successMessage = document.getElementById("form-success");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      // 1. Stop all default browser actions immediately
      e.preventDefault();
      e.stopImmediatePropagation();

      // 2. Gather data (matching your HTML IDs)
      const formData = {
        fullName: document.getElementById("name").value,
        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        annualVolume: document.getElementById("volume").value,
        message: document.getElementById("message").value,
        // Gather checkboxes into an array
        products: Array.from(
          document.querySelectorAll('input[name="products"]:checked'),
        ).map((cb) => cb.value),
      };

      // 3. Send to Zoho Flow using 'no-cors' to ignore the security block
      fetch("https://zoho.com", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData),
      })
        .then(() => {
          // Because of 'no-cors', we won't get a status back,
          // so we just assume success and show your message.
          contactForm.hidden = true;
          document.getElementById("form-success").hidden = false;
        })
        .catch((err) => {
          console.error("Submission Error:", err);
          alert("There was an error. Please try again.");
        });
    });
  }
});
