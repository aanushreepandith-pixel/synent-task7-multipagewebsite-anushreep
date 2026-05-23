/* ============================================
   SYNENT TECHNOLOGY — script.js
   ============================================ */

"use strict";

// ── 1. STICKY HEADER ──────────────────────────────────────────────────────────
const header = document.getElementById("site-header");
if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ── 2. HAMBURGER MENU ─────────────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll("span");
    if (isOpen) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.querySelectorAll("span").forEach(s => {
        s.style.transform = "";
        s.style.opacity   = "";
      });
    });
  });
}

// ── 3. INTERSECTION OBSERVER — REVEAL ANIMATIONS ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal, .reveal-card").forEach((el, i) => {
  // Stagger siblings inside the same parent
  const siblings = Array.from(el.parentNode.children).filter(c =>
    c.classList.contains("reveal-card") || c.classList.contains("reveal")
  );
  const idx = siblings.indexOf(el);
  if (idx > 0) el.style.transitionDelay = `${idx * 0.1}s`;
  revealObserver.observe(el);
});

// ── 4. COUNTER ANIMATION ──────────────────────────────────────────────────────
const counters = document.querySelectorAll(".stat-num");
let countersStarted = false;

function startCounters() {
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current = Math.min(current + step, target);
      counter.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

if (counters.length) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        startCounters();
      }
    },
    { threshold: 0.3 }
  );
  const statsEl = document.querySelector(".hero-stats");
  if (statsEl) heroObserver.observe(statsEl);
}

// ── 5. CONTACT FORM ───────────────────────────────────────────────────────────
const contactForm   = document.getElementById("contact-form");
const formSuccess   = document.getElementById("form-success");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const requiredFields = contactForm.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = "";
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = "#ef4444";
        field.addEventListener("input", () => {
          field.style.borderColor = "";
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate submission (replace with real API call)
    const submitBtn = contactForm.querySelector("[type='submit']");
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.querySelectorAll("input, select, textarea").forEach(f => f.value = "");
      submitBtn.style.display = "none";
      if (formSuccess) {
        formSuccess.classList.add("visible");
        formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 1400);
  });
}

// ── 6. SMOOTH ANCHOR SCROLL ───────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── 7. PARALLAX ON HERO ORBS ─────────────────────────────────────────────────
const orbs = document.querySelectorAll(".orb");
if (orbs.length && window.innerWidth > 768) {
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const strength = i === 0 ? 20 : 12;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  }, { passive: true });
}

// ── 8. PAGE ENTRY TRANSITION ─────────────────────────────────────────────────
document.documentElement.style.opacity = "0";
document.documentElement.style.transition = "opacity 0.5s ease";

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.documentElement.style.opacity = "1";
  });
});

// Fade out on internal link navigation
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  if (link.hostname === location.hostname) {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === location.pathname.split("/").pop()) return;
      e.preventDefault();
      document.documentElement.style.opacity = "0";
      setTimeout(() => {
        window.location.href = link.href;
      }, 400);
    });
  }
});