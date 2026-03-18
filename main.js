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

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Capture multi-select checkboxes for Products
    const selectedProducts = Array.from(
      document.querySelectorAll('input[name="products"]:checked'),
    ).map((checkbox) => checkbox.value);

    // 2. Map all form fields to a JSON object
    const formData = {
      fullName: document.getElementById("name").value,
      title: document.getElementById("title").value,
      company: document.getElementById("company").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      productsOfInterest: selectedProducts, // Sends as an array
      annualVolume: document.getElementById("volume").value,
      message: document.getElementById("message").value,
    };

    try {
      // 3. Send to Zoho Flow Webhook
      const response = await fetch(
        "https://flow.zoho.com/899150883/flow/webhook/incoming?zapikey=1001.1039014c937738121e0c0141dcac731e.ef6fd6d5e3dbff0f7b77773f5cc1b1dc&isdebug=false",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        contactForm.hidden = true; // Hide form on success
        successMessage.hidden = false; // Show your success div
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("There was an issue sending your request. Please try again.");
    }
  });
});
