/* ==========================================================
   Xava Group
   ========================================================== */

/*
  Contact form setup
  ------------------
  FORM_ENDPOINT: paste a form-handling endpoint here (e.g. Formspree:
  "https://formspree.io/f/xxxxxxx"). Leave it empty and the form will
  instead open the visitor's email app with the message pre-filled,
  addressed to CONTACT_EMAIL.
*/
const FORM_ENDPOINT = "https://formspree.io/f/xkjgzrwp";
const CONTACT_EMAIL = "hello@xavagroup.com";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Nav background once the page is scrolled (observer avoids forced layout)
const nav = document.querySelector(".nav");
const sentinel = document.querySelector(".top-sentinel");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => nav.classList.toggle("is-scrolled", !entry.isIntersecting)).observe(sentinel);
}

// Reveal on scroll, staggered within each parent
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 5) * 0.08}s`);
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Cursor-follow glow on brand cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Contact form
const form = document.getElementById("contact-form");
const statusEl = form.querySelector(".form__status");
const submitBtn = form.querySelector('button[type="submit"]');
const btnLabel = submitBtn.querySelector(".btn__label");

const setStatus = (msg, type = "") => {
  statusEl.textContent = msg;
  statusEl.className = `form__status${type ? ` is-${type}` : ""}`;
};

const validate = () => {
  let ok = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const valid = input.value.trim() !== "" && input.checkValidity();
    input.closest(".field").classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  return ok;
};

form.addEventListener("input", (e) => {
  const field = e.target.closest(".field");
  if (field && field.classList.contains("is-invalid") && e.target.checkValidity() && e.target.value.trim()) {
    field.classList.remove("is-invalid");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form._gotcha.value) return; // bot

  if (!validate()) {
    setStatus("Please fill in your name, a valid email and a message.", "error");
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  delete data._gotcha;

  if (!FORM_ENDPOINT) {
    const subject = `[Xava Group] ${data.topic}${data.invoice ? ` (${data.invoice})` : ""}`;
    const body =
      `${data.message}\n\n---\nName: ${data.name}\nEmail: ${data.email}` +
      (data.invoice ? `\nInvoice: ${data.invoice}` : "");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Opening your email app. Just hit send.", "success");
    return;
  }

  submitBtn.disabled = true;
  btnLabel.textContent = "Sending…";
  setStatus("");

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: `[Xava Group] ${data.topic}${data.invoice ? ` (${data.invoice})` : ""}` }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.reset();
    setStatus("Thanks! Your message is on its way. We'll be in touch soon.", "success");
  } catch {
    setStatus(`Something went wrong. Please email us directly at ${CONTACT_EMAIL}.`, "error");
  } finally {
    submitBtn.disabled = false;
    btnLabel.textContent = "Send message";
  }
});
