/**
 * VOID Landing — GSAP animations & interactions
 */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Init Three.js (showcase only — hero uses void image)
  if (window.VoidScenes) {
    window.VoidScenes.initShowcase();
  }

  // DOM particles in hero
  function createDomParticles() {
    const container = document.getElementById("heroParticles");
    if (!container) return;
    const count = isMobile ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "dom-particle";
      p.style.cssText = `
        position:absolute;
        width:${2 + Math.random() * 3}px;
        height:${2 + Math.random() * 3}px;
        background:rgba(168,85,247,${0.2 + Math.random() * 0.5});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        box-shadow:0 0 ${8 + Math.random() * 12}px rgba(139,92,246,0.6);
        pointer-events:none;
      `;
      container.appendChild(p);

      if (!prefersReducedMotion) {
        gsap.to(p, {
          y: -30 - Math.random() * 50,
          x: (Math.random() - 0.5) * 40,
          opacity: 0,
          duration: 4 + Math.random() * 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 4,
        });
      }
    }
  }

  createDomParticles();

  // Cursor glow + violet neon pointer
  const cursorGlow = document.getElementById("cursorGlow");
  const cursorPointer = document.getElementById("cursorPointer");
  if (!isMobile && (cursorGlow || cursorPointer)) {
    let glowX = 0;
    let glowY = 0;
    let ptrX = 0;
    let ptrY = 0;
    let tx = 0;
    let ty = 0;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    document.addEventListener("mousedown", () => {
      cursorPointer?.classList.add("is-clicking");
    });
    document.addEventListener("mouseup", () => {
      cursorPointer?.classList.remove("is-clicking");
    });

    function updateCursor() {
      glowX += (tx - glowX) * 0.12;
      glowY += (ty - glowY) * 0.12;
      ptrX += (tx - ptrX) * 0.7;
      ptrY += (ty - ptrY) * 0.7;

      if (cursorGlow) {
        cursorGlow.style.left = glowX + "px";
        cursorGlow.style.top = glowY + "px";
      }
      if (cursorPointer) {
        cursorPointer.style.left = ptrX + "px";
        cursorPointer.style.top = ptrY + "px";
      }
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // Navbar scroll
  const navbar = document.getElementById("navbar");
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => {
      navbar?.classList.toggle("scrolled", self.scroll() > 50);
    },
  });

  // Mobile menu
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  navToggle?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
    document.body.style.overflow = mobileMenu?.classList.contains("open") ? "hidden" : "";
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // Hero text reveal
  if (!prefersReducedMotion) {
    gsap.to(".hero-title .word", {
      y: 0,
      opacity: 1,
      duration: 1.4,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.3,
    });

    gsap.from(".hero-tagline", {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 1.2,
      ease: "power3.out",
    });

    gsap.from(".hero-micro", {
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      delay: 0.8,
    });
  } else {
    gsap.set(".hero-title .word, .hero-tagline, .reveal", { opacity: 1, y: 0, clearProps: "transform" });
  }

  // Scroll reveals
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  });

  // Parallax hero typography
  if (!prefersReducedMotion) {
    gsap.to(".hero-title--1", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: -80,
      opacity: 0.3,
    });

    gsap.to(".hero-title--2", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
      y: -120,
      opacity: 0.2,
    });

    gsap.to(".hero-void-art", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      scale: 0.7,
      y: 60,
    });
  }

  // Section blur-to-clear
  gsap.utils.toArray(".section").forEach((section) => {
  if (!prefersReducedMotion) {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        end: "top 60%",
        scrub: 1,
      },
      filter: "blur(8px)",
      opacity: 0.6,
      ease: "none",
    });
  }
  });

  // Counter animation
  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent = isDecimal
                  ? this.targets()[0].val.toFixed(1)
                  : Math.round(this.targets()[0].val);
              },
            }
          );
        },
      });
    });
  }
  animateCounters();

  // Magnetic buttons
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    if (isMobile) return;
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    });
  });

  // Card tilt & glow position
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");

      if (isMobile) return;
      const rotX = (y - 50) / 25;
      const rotY = (x - 50) / -25;
      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
    });
  });

  // Bento cards stagger
  gsap.from(".bento-card", {
    scrollTrigger: {
      trigger: ".bento-grid",
      start: "top 80%",
    },
    opacity: 0,
    y: 60,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
  });

  // Vision bg parallax
  gsap.to(".vision-bg-text", {
    scrollTrigger: {
      trigger: ".vision",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    x: -100,
    ease: "none",
  });

  // Contact form
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector(".btn-primary span");
    if (btn) {
      const original = btn.textContent;
      btn.textContent = "Signal transmitted ✦";
      gsap.fromTo(
        btn.parentElement,
        { boxShadow: "0 0 20px rgba(139,92,246,0.3)" },
        { boxShadow: "0 0 80px rgba(139,92,246,0.8)", duration: 0.6, yoyo: true, repeat: 1 }
      );
      setTimeout(() => {
        btn.textContent = original;
        e.target.reset();
      }, 2500);
    }
  });

  // Smooth anchor scroll
  if (typeof ScrollToPlugin !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      if (typeof ScrollToPlugin !== "undefined") {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: "power3.inOut",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
