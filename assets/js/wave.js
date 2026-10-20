/* ==========================================================================
   wave.js — generative pixel-art wave
   --------------------------------------------------------------------------
   The signature element of the Wild design system: a heightfield of summed
   sines, sampled on a --cell:14px grid, quantised into six flat colour bands,
   with a static hash dither so the crest breaks into pixels instead of a
   smooth curve.

   Three layers are composited back-to-front (soft / mid / full) so the mass
   reads as depth rather than a single silhouette.

   Pixel-perfect: the cell is rounded to whole device pixels and every rect is
   drawn in device space, so there are no seams and no anti-aliasing blur.
   ========================================================================== */
(function (global) {
  "use strict";

  /* — colour ramps (index 0 = above the surface, unused) ————————————— */
  var RAMPS = {
    light: {
      bg: "#ffffff",
      full: [null, "#d8ff00", "#b3b9ca", "#6b7385", "#1e2544", "#0a0a0a"],
      mid: [null, "#dcfc04", "#b3b9ca", "#6b7385", "#1e2544", "#1e2544"],
      soft: [null, "#b3b9ca", "#b3b9ca", "#6b7385", "#8b8b8b", "#6b7385"]
    },
    dark: {
      bg: "#0a0a0a",
      full: [null, "#d8ff00", "#6b7385", "#b3b9ca", "#ffffff", "#ffffff"],
      mid: [null, "#dcfc04", "#1e2544", "#6b7385", "#b3b9ca", "#ffffff"],
      soft: [null, "#1e2544", "#1e2544", "#6b7385", "#6b7385", "#b3b9ca"]
    }
  };

  /* — wave layers, back to front ————————————————————————————————————— */
  var LAYERS = [
    { ramp: "soft", alpha: 0.55, base: 0.26, amp: 0.16, f1: 0.8, f2: 2.1, f3: 4.1, sp: 0.40, ph: 0.0 },
    { ramp: "mid", alpha: 0.85, base: 0.46, amp: 0.22, f1: 1.1, f2: 2.7, f3: 5.3, sp: 0.62, ph: 2.1 },
    { ramp: "full", alpha: 1.0, base: 0.66, amp: 0.28, f1: 1.4, f2: 3.3, f3: 6.1, sp: 0.85, ph: 4.3 }
  ];

  var TAU = Math.PI * 2;

  /* — static per-cell dither (no flicker between frames) ——————————————— */
  function hash(x, y, seed) {
    var h = (x * 374761393 + y * 668265263 + seed * 1013904223) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /* — surface height for one layer, in cell rows ——————————————————————— */
  function surface(u, t, L, rows) {
    var a = Math.sin(u * TAU * L.f1 + t * L.sp + L.ph) * 0.52;
    var b = Math.sin(u * TAU * L.f2 - t * L.sp * 1.55 + L.ph * 1.7) * 0.26;
    var c = Math.sin(u * TAU * L.f3 + t * L.sp * 2.2 + L.ph * 0.6) * 0.13;
    var d = Math.sin(u * TAU * 0.63 + t * 0.21 + L.ph * 0.5) * 0.30;
    return rows * (L.base + (a + b + c + d) * 0.5 * L.amp);
  }

  /* ---------------------------------------------------------------------
     render(ctx, opts)
       w, h   : device pixels
       cell   : device pixels per cell
       t      : time in seconds
       seed   : integer, changes the dither pattern
       theme  : 'light' | 'dark'
       rows/cols derived from w,h,cell
     --------------------------------------------------------------------- */
  function render(ctx, o) {
    var cols = Math.ceil(o.w / o.cell);
    var rows = Math.ceil(o.h / o.cell);
    var cell = o.cell;
    var seed = o.seed;
    var theme = RAMPS[o.theme] ? o.theme : "light";
    var ramp = RAMPS[theme];
    var step = Math.max(1.5, rows * 0.085);
    var bands = 6;

    // The context is opaque (alpha:false) for speed, so the "paper" has to be
    // painted — clearRect would give us black.
    ctx.globalAlpha = 1;
    ctx.fillStyle = ramp.bg;
    ctx.fillRect(0, 0, o.w, o.h);

    // precompute one surface sample per column per layer (keeps sin() out of
    // the inner loop — that's a ~10x win at this grid size)
    var surf = [];
    for (var l = 0; l < LAYERS.length; l++) {
      var L = LAYERS[l];
      var s = new Float32Array(cols);
      for (var i = 0; i < cols; i++) s[i] = surface(i / cols, o.t, L, rows);
      surf.push(s);
    }

    for (var l2 = 0; l2 < LAYERS.length; l2++) {
      var layer = LAYERS[l2];
      var ramp = RAMPS[theme][layer.ramp];
      var sf = surf[l2];

      ctx.globalAlpha = layer.alpha;

      for (var j = 0; j < rows; j++) {
        var y = j * cell;
        var runStart = 0;
        var runLevel = -2;

        for (var ii = 0; ii <= cols; ii++) {
          var lv = 0;
          if (ii < cols) {
            var d = j - sf[ii] + (hash(ii, j, seed) - 0.5) * 1.7;
            if (d >= 0) {
              lv = 1 + Math.floor(d / step);
              if (lv > bands - 1) lv = bands - 1;
            }
          } else {
            lv = -1; // flush the last run
          }

          if (lv !== runLevel) {
            if (runLevel > 0) {
              ctx.fillStyle = ramp[runLevel];
              ctx.fillRect(
                runStart * cell,
                y,
                (ii - runStart) * cell,
                cell
              );
            }
            runStart = ii;
            runLevel = lv;
          }
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  /* — mount an animated wave on a canvas ——————————————————————————————— */
  function mount(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d", { alpha: false });
    var cellCss = opts.cell || 14;
    var seed = opts.seed || 0xa4c1;
    var speed = opts.speed || 1;
    var reduced = global.matchMedia
      ? global.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };

    var t = 1.7;
    var raf = 0;
    var last = 0;
    var visible = true;
    var w = 0;
    var h = 0;
    var cell = cellCss;

    function theme() {
      return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    }

    function measure() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var cw = Math.max(1, Math.round(rect.width));
      var ch = Math.max(1, Math.round(rect.height));
      cell = Math.max(4, Math.round(cellCss * dpr)); // whole device pixels
      var nw = Math.round(cw * dpr);
      var nh = Math.round(ch * dpr);
      if (nw !== w || nh !== h || canvas.width !== nw) {
        w = nw;
        h = nh;
        canvas.width = nw;
        canvas.height = nh;
      }
      return { w: w, h: h, cell: cell, t: t, seed: seed, theme: theme() };
    }

    function draw() {
      render(ctx, { w: w, h: h, cell: cell, t: t, seed: seed, theme: theme() });
    }

    function frame(now) {
      raf = 0;
      if (!visible) return;
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      t += dt * speed;
      draw();
      raf = global.requestAnimationFrame(frame);
    }

    function play() {
      if (raf || reduced.matches) return;
      last = 0;
      raf = global.requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) global.cancelAnimationFrame(raf);
      raf = 0;
    }

    function onResize() {
      measure();
      draw();
    }

    // kick off
    onResize();
    play();

    if (global.ResizeObserver) {
      new global.ResizeObserver(onResize).observe(canvas);
    } else {
      global.addEventListener("resize", onResize);
    }

    if (global.IntersectionObserver) {
      new global.IntersectionObserver(
        function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) play();
          else stop();
        },
        { rootMargin: "100px" }
      ).observe(canvas);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else play();
    });

    if (reduced.addEventListener) {
      reduced.addEventListener("change", function () {
        stop();
        draw();
        play();
      });
    }

    return {
      redraw: function () {
        measure();
        draw();
      },
      setSeed: function (n) {
        seed = n;
        draw();
      }
    };
  }

  /* — one-off static wave (used for the work thumbnails) ——————————————— */
  function thumbnail(canvas, seed, themeName, cellCss) {
    var ctx = canvas.getContext("2d", { alpha: false });
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    var w = Math.round((rect.width || canvas.width) * dpr);
    var h = Math.round((rect.height || canvas.height) * dpr);
    canvas.width = w;
    canvas.height = h;
    var cell = Math.max(3, Math.round((cellCss || 6) * dpr));
    render(ctx, {
      w: w,
      h: h,
      cell: cell,
      t: 1.7 + (seed % 97) * 0.13,
      seed: seed,
      theme: themeName || "light"
    });
  }

  global.PixelWave = { mount: mount, thumbnail: thumbnail };
})(window);
