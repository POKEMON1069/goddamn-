/* ==========================================================================
   app.js — marquees, clock, theme, reveals, work preview
   --------------------------------------------------------------------------
   One rAF ticker drives everything (marquees + cursor floater) so the page
   never runs more than one animation loop.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  /* matchMedia is universal in real browsers, but guard anyway so the page
     never hard-fails in odd embedding contexts (and in JSDOM). */
  function mq(query) {
    return window.matchMedia
      ? window.matchMedia(query)
      : { matches: false, addEventListener: function () {} };
  }

  var reduced = mq("(prefers-reduced-motion: reduce)");
  var fineHover = mq("(hover: hover) and (pointer: fine)");

  /* ======================================================================
     1 — MARQUEES
     Duplicates one group until the track overflows the viewport, then loops
     the translate by exactly one group width. Scroll velocity is added on
     top and decays, so a flick of the wheel shoves the type along.
     ====================================================================== */
  var marquees = [];

  function initMarquees() {
    var els = doc.querySelectorAll("[data-marquee]");

    for (var k = 0; k < els.length; k++) {
      (function (el) {
        var track = el.querySelector(".marquee__track");
        var group = el.querySelector(".marquee__group");
        if (!track || !group) return;

        var speed = parseFloat(el.getAttribute("data-speed")) || 40;
        var gw = 0;
        var x = 0;

        function build() {
          var extra = [].slice.call(track.children, 1);
          for (var i = 0; i < extra.length; i++) extra[i].remove();

          gw = group.getBoundingClientRect().width;
          if (!gw) return;

          var vw = el.getBoundingClientRect().width || window.innerWidth;
          var n = Math.ceil(vw / gw) + 2;
          for (var j = 0; j < n; j++) {
            var c = group.cloneNode(true);
            c.setAttribute("aria-hidden", "true");
            track.appendChild(c);
          }
        }

        function tick(dt, boost) {
          if (!gw) return;
          x -= (speed + boost) * dt;
          while (x <= -gw) x += gw;
          while (x > 0) x -= gw;
          track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
        }

        build();
        marquees.push({ el: el, build: build, tick: tick });

        if (window.ResizeObserver) {
          var ro = new ResizeObserver(function () {
            build();
          });
          ro.observe(el);
        }
      })(els[k]);
    }
  }

  /* ======================================================================
     2 — SCROLL STATE: progress bar, sticky header, nav highlight, velocity
     ====================================================================== */
  var boost = 0;
  var lastY = window.scrollY || 0;

  function onScroll() {
    var y = window.scrollY || 0;
    var max = doc.documentElement.scrollHeight - window.innerHeight;

    root.style.setProperty("--progress", max > 0 ? Math.min(y / max, 1) : 0);

    var head = doc.getElementById("head");
    if (head) head.classList.toggle("is-stuck", y > 8);

    boost += (y - lastY) * 0.8;
    if (boost > 900) boost = 900;
    if (boost < -900) boost = -900;
    lastY = y;
  }

  function initNavHighlight() {
    var links = [].slice.call(doc.querySelectorAll(".head__nav a"));
    if (!links.length || !window.IntersectionObserver) return;

    var map = {};
    var sections = [];

    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = doc.getElementById(id);
      if (sec) {
        map[id] = a;
        sections.push(sec);
      }
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.removeAttribute("aria-current");
          });
          var a = map[e.target.id];
          if (a) a.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ======================================================================
     3 — REVEALS
     ====================================================================== */
  function initReveals() {
    var els = doc.querySelectorAll(".reveal");
    if (!window.IntersectionObserver) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ======================================================================
     4 — CLOCK (Patna / IST)
     ====================================================================== */
  function initClock() {
    var nodes = [
      doc.getElementById("clock"),
      doc.getElementById("clock-2"),
      doc.getElementById("clock-3")
    ].filter(Boolean);
    if (!nodes.length) return;

    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    } catch (err) {
      fmt = null;
    }

    function tick() {
      var s;
      if (fmt) {
        s = fmt.format(new Date());
      } else {
        var d = new Date();
        s = [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map(function (n) {
            return String(n).padStart(2, "0");
          })
          .join(":");
      }
      for (var i = 0; i < nodes.length; i++) nodes[i].textContent = s;
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ======================================================================
     5 — THEME
     ====================================================================== */
  var wave = null;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(name, persist) {
    root.setAttribute("data-theme", name);

    var label = doc.getElementById("theme-label");
    var readout = doc.getElementById("mode-readout");
    var btn = doc.getElementById("theme-toggle");
    if (label) label.textContent = name === "dark" ? "Dark" : "Light";
    if (readout) readout.textContent = name;
    if (btn) btn.setAttribute("aria-pressed", name === "dark" ? "true" : "false");

    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", name === "dark" ? "#0a0a0a" : "#ffffff");

    if (persist) {
      try {
        localStorage.setItem("ac-theme", name);
      } catch (e) {}
    }

    // pixel art follows the theme
    thumbCache = {};
    if (wave && wave.redraw) wave.redraw();
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem("ac-theme");
    } catch (e) {}
    if (!stored && window.matchMedia) {
      stored = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    applyTheme(stored === "dark" ? "dark" : "light", false);

    var btn = doc.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  /* ======================================================================
     6 — WORK PREVIEW FLOATER
     A generative pixel thumbnail per project, seeded from data-seed, that
     trails the cursor while a row is hovered.
     ====================================================================== */
  var thumbCache = {};

  function initFloater() {
    var floater = doc.getElementById("floater");
    var canvas = doc.getElementById("floater-canvas");
    var tag = doc.getElementById("floater-tag");
    var rows = [].slice.call(doc.querySelectorAll(".work__row"));
    if (!floater || !canvas || !rows.length) return;
    if (!fineHover.matches || reduced.matches) {
      floater.remove();
      return;
    }

    var tx = window.innerWidth / 2;
    var ty = window.innerHeight / 2;
    var cx = tx;
    var cy = ty;
    var scale = 0.9;
    var tScale = 0.9;
    var on = false;
    var currentSeed = null;
    var size = { w: 260, h: 172 };

    function drawThumb(seed) {
      if (thumbCache[seed]) return;
      if (!window.PixelWave) return;
      window.PixelWave.thumbnail(canvas, seed, currentTheme(), 6);
      thumbCache[seed] = true;
    }

    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var seed = parseInt(row.getAttribute("data-seed"), 10) || 1;
        if (seed !== currentSeed) {
          currentSeed = seed;
          drawThumb(seed);
        }
        if (tag) tag.textContent = row.getAttribute("data-title") || "Preview";
        on = true;
        floater.classList.add("is-on");
      });

      row.addEventListener("mouseleave", function () {
        on = false;
        floater.classList.remove("is-on");
      });
    });

    window.addEventListener(
      "pointermove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );

    return function tick(dt) {
      // critically-damped-ish follow
      var k = 1 - Math.pow(0.0001, dt);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      tScale = on ? 1 : 0.9;
      scale += (tScale - scale) * k * 0.6;

      var rect = floater.getBoundingClientRect();
      var w = rect.width || size.w;
      var h = rect.height || size.h;
      floater.style.transform =
        "translate3d(" +
        (cx - w / 2).toFixed(2) +
        "px," +
        (cy - h / 2).toFixed(2) +
        "px,0) scale(" +
        scale.toFixed(3) +
        ")";
    };
  }

  /* ======================================================================
     7 — COPY EMAIL
     ====================================================================== */
  function initCopy() {
    var btn = doc.getElementById("copy");
    if (!btn) return;
    var label = doc.getElementById("copy-label");
    var timer;

    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-value") || "";

      function done() {
        btn.setAttribute("data-copied", "true");
        if (label) label.textContent = "Copied ✓";
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.removeAttribute("data-copied");
          if (label) label.textContent = "Copy email";
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = doc.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        doc.body.appendChild(ta);
        ta.select();
        try {
          doc.execCommand("copy");
          done();
        } catch (e) {}
        doc.body.removeChild(ta);
      }
    });
  }

  /* ======================================================================
     8 — TICKER
     ====================================================================== */
  function startTicker(fn) {
    var last = 0;
    function loop(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      fn(dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    initTheme();

    var stage = doc.getElementById("wave");
    if (stage && window.PixelWave) {
      wave = window.PixelWave.mount(stage, { cell: 14, seed: 0xa4c1, speed: 0.55 });
    }

    initMarquees();
    initReveals();
    initNavHighlight();
    initClock();
    initCopy();

    var floaterTick = initFloater();

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var animateMarquees = !reduced.matches;

    startTicker(function (dt) {
      if (animateMarquees) {
        for (var i = 0; i < marquees.length; i++) marquees[i].tick(dt, boost);
      }
      if (floaterTick) floaterTick(dt);
      boost *= Math.pow(0.88, dt * 60);
      if (Math.abs(boost) < 0.5) boost = 0;
    });

    var rebuild = function () {
      for (var i = 0; i < marquees.length; i++) marquees[i].build();
    };
    window.addEventListener("resize", rebuild);
    // fonts change the marquee width — rebuild once they land
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(rebuild);

    if (reduced.addEventListener) {
      reduced.addEventListener("change", function () {
        animateMarquees = !reduced.matches;
      });
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
