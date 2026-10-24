/* ==========================================================================
   QINTARA — the aperture instrument
   A small canvas demonstration that makes the studio's "instrument" claim
   tangible. Two modes, two parameters, keyboard-operable through native
   range inputs, and a static frame when motion is reduced.
   ========================================================================== */

const TAU = Math.PI * 2;

const PALETTE = {
  ink: '#14110c',
  inkLift: '#1d1913',
  bone: 'rgba(242, 236, 225, 0.55)',
  boneFaint: 'rgba(242, 236, 225, 0.16)',
  boneStrong: 'rgba(242, 236, 225, 0.86)',
  vermilion: '#c0492a',
  vermilionSoft: 'rgba(192, 73, 42, 0.22)',
};

export function createInstrument(root, { reduceMotion } = {}) {
  const canvas = root.querySelector('canvas');
  const fallback = root.querySelector('[data-instrument-fallback]');
  const stage = root.querySelector('[data-instrument-stage]');
  const readout = root.querySelector('[data-instrument-readout]');

  if (!canvas || !stage) return;

  const context = canvas.getContext('2d');
  if (!context) {
    canvas.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  const frequencyInput = root.querySelector('[data-param="frequency"]');
  const apertureInput = root.querySelector('[data-param="aperture"]');
  const frequencyValue = root.querySelector('[data-value="frequency"]');
  const apertureValue = root.querySelector('[data-value="aperture"]');
  const modeButtons = [...root.querySelectorAll('[data-mode]')];

  const state = {
    mode: 'rings',
    frequency: Number(frequencyInput?.value ?? 7),
    aperture: Number(apertureInput?.value ?? 62) / 100,
    time: 0,
    width: 0,
    height: 0,
    dpr: 1,
    visible: true,
    raf: 0,
    lastStamp: 0,
  };

  /* --- Sizing --------------------------------------------------------- */

  function resize() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = rect.width;
    state.height = rect.height;

    canvas.width = Math.round(rect.width * state.dpr);
    canvas.height = Math.round(rect.height * state.dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    draw();
  }

  /* --- Drawing -------------------------------------------------------- */

  function drawGrid(w, h) {
    const step = Math.max(24, Math.round(Math.min(w, h) / 14));

    context.save();
    context.strokeStyle = PALETTE.boneFaint;
    context.lineWidth = 1;

    context.beginPath();
    for (let x = step; x < w; x += step) {
      context.moveTo(Math.round(x) + 0.5, 0);
      context.lineTo(Math.round(x) + 0.5, h);
    }
    for (let y = step; y < h; y += step) {
      context.moveTo(0, Math.round(y) + 0.5);
      context.lineTo(w, Math.round(y) + 0.5);
    }
    context.stroke();

    // Registration marks in the corners — a print-shop detail.
    const mark = Math.min(14, w / 18);
    context.strokeStyle = PALETTE.bone;
    context.beginPath();
    [
      [step / 2, step / 2, 1, 1],
      [w - step / 2, step / 2, -1, 1],
      [step / 2, h - step / 2, 1, -1],
      [w - step / 2, h - step / 2, -1, -1],
    ].forEach(([x, y, dx, dy]) => {
      context.moveTo(x, y);
      context.lineTo(x + mark * dx, y);
      context.moveTo(x, y);
      context.lineTo(x, y + mark * dy);
    });
    context.stroke();
    context.restore();
  }

  function drawRings(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.42;
    const inner = maxRadius * (0.14 + state.aperture * 0.36);
    const rings = 9;

    for (let i = 0; i < rings; i += 1) {
      const progress = i / (rings - 1);
      const radius = inner + (maxRadius - inner) * progress;
      const amplitude = (maxRadius - inner) * 0.09 * state.aperture * (0.35 + progress);
      const highlight = Math.abs(progress - 0.62) < 0.12;

      context.beginPath();
      const steps = 180;
      for (let s = 0; s <= steps; s += 1) {
        const theta = (s / steps) * TAU;
        const wave =
          Math.sin(theta * state.frequency + state.time * 0.9 + i * 0.55) *
          amplitude *
          (0.4 + progress * 0.6);
        const r = radius + wave;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (s === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.strokeStyle = highlight ? PALETTE.vermilion : PALETTE.bone;
      context.lineWidth = highlight ? 1.6 : 1;
      context.stroke();
    }

    // Core: a filled aperture stop with a vermilion centre.
    context.beginPath();
    context.arc(cx, cy, inner * 0.34, 0, TAU);
    context.fillStyle = PALETTE.inkLift;
    context.fill();
    context.strokeStyle = PALETTE.boneStrong;
    context.lineWidth = 1;
    context.stroke();

    context.beginPath();
    context.arc(cx, cy, Math.max(1.6, inner * 0.075), 0, TAU);
    context.fillStyle = PALETTE.vermilion;
    context.fill();

    // Cross-hairs out to the plate edge.
    context.strokeStyle = PALETTE.boneFaint;
    context.beginPath();
    context.moveTo(cx - maxRadius * 1.18, cy);
    context.lineTo(cx + maxRadius * 1.18, cy);
    context.moveTo(cx, cy - maxRadius * 1.18);
    context.lineTo(cx, cy + maxRadius * 1.18);
    context.stroke();

    // Angle ticks.
    context.strokeStyle = PALETTE.bone;
    for (let tick = 0; tick < 36; tick += 1) {
      const theta = (tick / 36) * TAU;
      const long = tick % 9 === 0;
      const r1 = maxRadius * (long ? 1.04 : 1.08);
      const r2 = maxRadius * 1.12;
      context.beginPath();
      context.moveTo(cx + Math.cos(theta) * r1, cy + Math.sin(theta) * r1);
      context.lineTo(cx + Math.cos(theta) * r2, cy + Math.sin(theta) * r2);
      context.stroke();
    }
  }

  function drawTrace(w, h) {
    const baseline = h * 0.5;
    const amplitude = h * (0.06 + state.aperture * 0.3);
    const samples = Math.min(640, Math.round(w));

    // Axis rules
    context.strokeStyle = PALETTE.boneFaint;
    context.beginPath();
    context.moveTo(0, Math.round(baseline) + 0.5);
    context.lineTo(w, Math.round(baseline) + 0.5);
    context.stroke();

    // Ghost envelope showing the aperture.
    context.fillStyle = PALETTE.vermilionSoft;
    context.fillRect(0, baseline - amplitude, w, amplitude * 2);

    // Primary trace
    context.beginPath();
    for (let s = 0; s <= samples; s += 1) {
      const x = (s / samples) * w;
      const phase = (s / samples) * TAU * state.frequency;
      const taper = Math.sin((s / samples) * Math.PI) ** 0.6;
      const y =
        baseline -
        Math.sin(phase + state.time * 1.2) * amplitude * taper -
        Math.sin(phase * 0.5 - state.time * 0.7) * amplitude * 0.22 * taper;
      if (s === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = PALETTE.boneStrong;
    context.lineWidth = 1.4;
    context.stroke();

    // Vermilion cursor at the sweep position.
    const cursorX = w * (0.5 + Math.sin(state.time * 0.6) * 0.34);
    context.strokeStyle = PALETTE.vermilion;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(cursorX, h * 0.14);
    context.lineTo(cursorX, h * 0.86);
    context.stroke();
  }

  function draw() {
    const { width: w, height: h } = state;
    if (!w || !h) return;

    context.clearRect(0, 0, w, h);
    context.fillStyle = PALETTE.ink;
    context.fillRect(0, 0, w, h);

    drawGrid(w, h);

    if (state.mode === 'trace') drawTrace(w, h);
    else drawRings(w, h);

    if (readout) {
      readout.textContent = `f ${String(state.frequency).padStart(2, '0')} · a ${state.aperture
        .toFixed(2)
        .slice(1)}`;
    }
  }

  /* --- Animation ------------------------------------------------------ */

  function loop(stamp) {
    state.raf = window.requestAnimationFrame(loop);

    const delta = state.lastStamp ? Math.min(stamp - state.lastStamp, 64) : 16;
    state.lastStamp = stamp;
    state.time += delta / 1000;

    draw();
  }

  function start() {
    if (reduceMotion?.matches) {
      draw();
      return;
    }
    if (state.raf) return;
    state.lastStamp = 0;
    state.raf = window.requestAnimationFrame(loop);
  }

  function stop() {
    if (!state.raf) return;
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  /* --- Controls ------------------------------------------------------- */

  function syncFromInputs() {
    if (frequencyInput) state.frequency = Number(frequencyInput.value);
    if (apertureInput) state.aperture = Number(apertureInput.value) / 100;

    if (frequencyValue) frequencyValue.textContent = String(state.frequency).padStart(2, '0');
    if (apertureValue) apertureValue.textContent = state.aperture.toFixed(2).slice(1);

    if (frequencyInput) {
      frequencyInput.setAttribute('aria-valuetext', `Frequency ${state.frequency}`);
    }
    if (apertureInput) {
      apertureInput.setAttribute('aria-valuetext', `Aperture ${Math.round(state.aperture * 100)}%`);
    }

    if (reduceMotion?.matches) draw();
  }

  frequencyInput?.addEventListener('input', () => {
    syncFromInputs();
    draw();
  });

  apertureInput?.addEventListener('input', () => {
    syncFromInputs();
    draw();
  });

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      modeButtons.forEach((other) => {
        other.setAttribute('aria-pressed', String(other === button));
      });
      draw();
    });
  });

  /* --- Direct manipulation of the plate ------------------------------- */

  let dragging = false;

  function applyPointer(event) {
    const rect = stage.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    if (frequencyInput) {
      const min = Number(frequencyInput.min || 1);
      const max = Number(frequencyInput.max || 14);
      frequencyInput.value = String(Math.round(min + x * (max - min)));
    }
    if (apertureInput) apertureInput.value = String(Math.round(y * 100));

    syncFromInputs();
    draw();
  }

  stage.addEventListener('pointerdown', (event) => {
    dragging = true;
    stage.setPointerCapture?.(event.pointerId);
    applyPointer(event);
  });

  stage.addEventListener('pointermove', (event) => {
    if (dragging) applyPointer(event);
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => {
    stage.addEventListener(type, () => {
      dragging = false;
    });
  });

  /* --- Lifecycle ------------------------------------------------------ */

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(stage);

  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    visibility.observe(stage);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (state.visible) start();
  });

  reduceMotion?.addEventListener?.('change', () => {
    stop();
    if (reduceMotion.matches) draw();
    else start();
  });

  syncFromInputs();
  resize();
  start();
}
