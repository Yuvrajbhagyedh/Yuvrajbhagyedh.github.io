(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme toggle
  const root = document.documentElement;
  const themeButtons = [
    document.getElementById("theme-toggle"),
    document.getElementById("theme-toggle-mobile"),
  ].filter(Boolean);

  const syncThemeUI = (theme) => {
    const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    themeButtons.forEach((btn) => btn.setAttribute("aria-label", nextLabel));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#050505" : "#f4f4f4";
  };

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("yk-theme", theme);
    } catch (_) {}
    syncThemeUI(theme);
  };

  syncThemeUI(root.getAttribute("data-theme") || "dark");

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  });

  // Preloader
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    setTimeout(() => pre.classList.add("is-done"), reduceMotion ? 0 : 650);
  });

  // Scroll progress + nav state
  const progress = document.getElementById("progress");
  const nav = document.getElementById("nav");

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  const closeMobile = () => {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
    document.body.style.overflow = "";
  };

  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
    document.body.style.overflow = open ? "" : "hidden";
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile);
  });

  // Skills marquee (JS so it always moves)
  const track = document.getElementById("trust-track");
  if (track) {
    let x = 0;
    const speed = reduceMotion ? 0 : 0.55; // ~33px/s — medium, not too slow
    const tickMarquee = () => {
      if (speed > 0) {
        x -= speed;
        const half = track.scrollWidth / 2;
        if (half > 0 && Math.abs(x) >= half) x = 0;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      requestAnimationFrame(tickMarquee);
    };
    requestAnimationFrame(tickMarquee);
  }

  // Scroll reveals
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal-scroll").forEach((el) => observer.observe(el));

  // Magnetic buttons
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 14;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Bengaluru clock
  const tick = () => {
    const time = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const navTime = document.getElementById("local-time");
    const heroTime = document.getElementById("local-time-hero");
    if (navTime) navTime.textContent = time;
    if (heroTime) heroTime.textContent = `${time} IST`;
  };
  tick();
  setInterval(tick, 30000);

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Tab title nudge
  const realTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "Still here — Yuvraj K" : realTitle;
  });
})();
