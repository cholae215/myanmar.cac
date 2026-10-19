"use strict";

document.documentElement.classList.add("js-motion");

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  const form = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const year = document.querySelector("#copyright-year");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.getAttribute("aria-disabled") === "true") {
          event.preventDefault();
          return;
        }
        closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (menuButton.getAttribute("aria-expanded") === "true" &&
          !navigation.contains(event.target) &&
          !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll(".social-placeholder").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  const revealElements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    document.documentElement.classList.remove("js-motion");
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    revealElements.forEach((element) => observer.observe(element));
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = new FormData(form).get("name").toString().trim();
      const message = `Thanks, ${name}. Your interest is noted in this demo. The form does not send or store your message.`;
      if (formStatus) formStatus.textContent = message;
      window.alert(`Thanks, ${name}! This demo form is not connected to an inbox yet, so your message has not been sent.`);
      form.reset();
    });
  }
});
