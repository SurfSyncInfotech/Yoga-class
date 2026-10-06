(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var veil = document.getElementById("veil");
  if (veil) {
    var hideVeil = function () { veil.classList.add("is-done"); };
    if (reduce) hideVeil();
    else window.addEventListener("load", function () { setTimeout(hideVeil, 700); });
  }

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("nav-panel");

  function onScroll() {
    var solid = window.scrollY > 40;
    document.body.classList.toggle("scrolled", solid);
    if (nav) nav.classList.toggle("is-solid", solid);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav && panel) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  var slides = document.querySelectorAll(".hero-slide");
  var quoteEl = document.querySelector(".hero-quote");
  var quoteText = document.querySelector(".hero-quote p");
  var quoteCite = document.querySelector(".hero-quote cite");
  var dots = document.querySelectorAll(".hero-ui .dots button");
  var quotes = [
    ["Yoga is the journey of the self, through the self, to the self.", "The Bhagavad Gita"],
    ["Inhale the future, exhale the past.", "Sanskrit proverb"],
    ["The pose begins when you want to leave it.", "B.K.S. Iyengar"],
    ["Yoga is not about touching your toes. It is what you learn on the way down.", "Jigar Gor"]
  ];
  var heroIndex = 0;
  var heroTimer;

  function showHero(index) {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.classList.toggle("is-active", i === heroIndex); });
    dots.forEach(function (dot, i) { dot.setAttribute("aria-selected", i === heroIndex ? "true" : "false"); });
    if (quoteText && quoteCite && quoteEl) {
      quoteEl.classList.add("is-fading");
      setTimeout(function () {
        quoteText.textContent = quotes[heroIndex][0];
        quoteCite.textContent = quotes[heroIndex][1];
        quoteEl.classList.remove("is-fading");
      }, reduce ? 0 : 280);
    }
  }

  function startHero() {
    if (reduce || slides.length < 2) return;
    clearInterval(heroTimer);
    heroTimer = setInterval(function () { showHero(heroIndex + 1); }, 2000);
  }

  if (slides.length) {
    var prev = document.querySelector("[data-hero='prev']");
    var next = document.querySelector("[data-hero='next']");
    if (prev) prev.addEventListener("click", function () { showHero(heroIndex - 1); startHero(); });
    if (next) next.addEventListener("click", function () { showHero(heroIndex + 1); startHero(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { showHero(i); startHero(); });
    });
    var hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("mouseenter", function () { clearInterval(heroTimer); });
      hero.addEventListener("mouseleave", startHero);
    }
    showHero(0);
    startHero();
  }

  var testimonials = document.querySelectorAll(".quote-stage blockquote");
  var tDots = document.querySelectorAll(".quote-nav button");
  var tIndex = 0;
  var tTimer;
  function showQuote(index) {
    if (!testimonials.length) return;
    tIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach(function (item, i) { item.classList.toggle("is-active", i === tIndex); });
    tDots.forEach(function (dot, i) { dot.setAttribute("aria-selected", i === tIndex ? "true" : "false"); });
  }
  if (testimonials.length) {
    tDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showQuote(i);
        clearInterval(tTimer);
        if (!reduce) tTimer = setInterval(function () { showQuote(tIndex + 1); }, 7000);
      });
    });
    showQuote(0);
    if (!reduce) tTimer = setInterval(function () { showQuote(tIndex + 1); }, 7000);
  }

  document.querySelectorAll(".day-switch button").forEach(function (button) {
    button.addEventListener("click", function () {
      var day = button.getAttribute("data-day");
      document.querySelectorAll(".day-switch button").forEach(function (b) {
        b.setAttribute("aria-selected", b === button ? "true" : "false");
      });
      document.querySelectorAll(".day-panel").forEach(function (panelEl) {
        panelEl.classList.toggle("is-active", panelEl.getAttribute("data-day") === day);
      });
    });
  });

  var revealSelector = [
    "main .sec-head",
    "main .intro-copy",
    "main .frame-photo",
    "main .method-item",
    "main .class-card",
    "main .ritual-step",
    "main .feature",
    "main .plan",
    "main .prep article",
    "main .story > *",
    "main .founder",
    "main .principles article",
    "main .faculty article",
    "main .room",
    "main .awards article",
    "main .faq details",
    "main form",
    "main .thanks",
    "main .desk",
    "main .visit-copy",
    "main .visit-grid > img",
    "main .close-band .inner",
    "main .page-hero .inner",
    "main .stats",
    "main .slot",
    "main .table-wrap",
    "main .teacher-rail article",
    "footer .foot-grid > div"
  ].join(", ");

  document.querySelectorAll(revealSelector).forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window && !reduce) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = entry.target.parentElement
          ? entry.target.parentElement.querySelectorAll(":scope > .reveal")
          : [];
        var index = Array.prototype.indexOf.call(siblings, entry.target);
        if (index > 0) entry.target.style.setProperty("--d", Math.min(index, 6) * 0.08 + "s");
        entry.target.classList.add("in");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  var form = document.getElementById("booking-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var chosen = params.get("class");
    var classField = form.querySelector("[name='class']");
    if (chosen && classField) {
      Array.prototype.forEach.call(classField.options, function (option) {
        if (option.value === chosen) classField.value = chosen;
      });
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var group = field.closest(".field");
        var empty = !field.value.trim();
        var emailBad = field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        var phoneBad = field.name === "phone" && field.value.replace(/\D/g, "").length < 10;
        var bad = empty || emailBad || phoneBad;
        if (group) group.classList.toggle("is-bad", bad);
        if (bad) valid = false;
      });
      if (!valid) return;
      form.classList.add("is-off");
      var thanks = document.getElementById("thanks");
      if (thanks) thanks.classList.add("is-on");
    });
    form.querySelectorAll("input, textarea, select").forEach(function (field) {
      field.addEventListener("input", function () {
        var group = field.closest(".field");
        if (group) group.classList.remove("is-bad");
      });
    });
    var reset = document.getElementById("write-again");
    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        form.classList.remove("is-off");
        document.getElementById("thanks").classList.remove("is-on");
      });
    }
  }
})();
