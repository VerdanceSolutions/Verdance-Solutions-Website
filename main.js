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
  const successMessage = document.getElementById("form-success");

  if (contactForm && successBlock) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      console.log("Form submit caught. Processing...");

      const formData = {
        fullName: document.getElementById("name").value,
        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        volume: document.getElementById("volume").value,
        message: document.getElementById("message").value,
        products: Array.from(
          document.querySelectorAll('input[name="products"]:checked'),
        ).map((cb) => cb.value),
      };

      // This is the bridge you were missing:
      fetch(
        "https://flow.zoho.com/899150883/flow/webhook/incoming?zapikey=1001.26ffad7e21e73319a764d74752dd4c45.f4c12ed0122f3ac1df10f3c5dc57bed3&isdebug=false://zoho.com",
        {
          method: "POST",
          mode: "no-cors", // Bypasses the CORS check you saw in API Tester
          cache: "no-cahe", // Bypass local browser cache
          body: JSON.stringify(formData),
        },
      )
        .then(() => {
          console.log("Fetch executed successfully.");
          contactForm.style.display = "none";
          document.getElementById("form-success").hidden = false;
        })
        .catch((err) => console.error("Integration failed:", err));

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
});
