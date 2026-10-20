#!/usr/bin/env python3
"""Generate favicon.svg and og.svg from the same wave maths as assets/js/wave.js.

Regenerate after tweaking the algorithm so the static art stays in sync:

    python3 tools/make-graphics.py
"""
import math
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAU = math.tau

LAYERS = [
    # ramp, alpha, base, amp, f1, f2, f3, sp, ph
    ("soft", 0.55, 0.26, 0.16, 0.8, 2.1, 4.1, 0.40, 0.0),
    ("mid", 0.85, 0.46, 0.22, 1.1, 2.7, 5.3, 0.62, 2.1),
    ("full", 1.00, 0.66, 0.28, 1.4, 3.3, 6.1, 0.85, 4.3),
]

RAMPS = {
    "soft": [None, "#b3b9ca", "#b3b9ca", "#6b7385", "#8b8b8b", "#6b7385"],
    "mid": [None, "#dcfc04", "#b3b9ca", "#6b7385", "#1e2544", "#1e2544"],
    "full": [None, "#d8ff00", "#b3b9ca", "#6b7385", "#1e2544", "#0a0a0a"],
}

SEED = 0xA4C1
T = 1.7


def hash_xy(x, y, seed):
    h = (x * 374761393 + y * 668265263 + seed * 1013904223) & 0xFFFFFFFF
    h = (h ^ (h >> 13)) * 1274126177 & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFFFFFF) / 4294967296


def surface(u, t, L, rows):
    ramp, alpha, base, amp, f1, f2, f3, sp, ph = L
    a = math.sin(u * TAU * f1 + t * sp + ph) * 0.52
    b = math.sin(u * TAU * f2 - t * sp * 1.55 + ph * 1.7) * 0.26
    c = math.sin(u * TAU * f3 + t * sp * 2.2 + ph * 0.6) * 0.13
    d = math.sin(u * TAU * 0.63 + t * 0.21 + ph * 0.5) * 0.30
    return rows * (base + (a + b + c + d) * 0.5 * amp)


def wave_rects(w, h, cell, layers=LAYERS):
    """Return a list of (x, y, rw, rh, fill, opacity) run-length encoded."""
    cols, rows = math.ceil(w / cell), math.ceil(h / cell)
    step = max(1.5, rows * 0.085)
    out = []
    for L in layers:
        ramp_name, alpha = L[0], L[1]
        ramp = RAMPS[ramp_name]
        surf = [surface(i / cols, T, L, rows) for i in range(cols)]
        for j in range(rows):
            y = j * cell
            run_start, run_level = 0, -2
            for i in range(cols + 1):
                lv = 0
                if i < cols:
                    d = j - surf[i] + (hash_xy(i, j, SEED) - 0.5) * 1.7
                    if d >= 0:
                        lv = min(5, 1 + int(d // step))
                else:
                    lv = -1
                if lv != run_level:
                    if run_level > 0:
                        out.append(
                            (run_start * cell, y, (i - run_start) * cell, cell,
                             ramp[run_level], alpha)
                        )
                    run_start, run_level = i, lv
    return out


def svg_rects(rects):
    return "\n".join(
        '  <rect x="%g" y="%g" width="%g" height="%g" fill="%s" opacity="%g"/>'
        % r
        for r in rects
    )


# --------------------------------------------------------------------------
# favicon — 64×64, 4px cells
# --------------------------------------------------------------------------
def favicon():
    w = h = 64
    rects = wave_rects(w, h, 4, layers=LAYERS[1:])  # skip the faint back layer
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="{w}" height="{h}" fill="#ffffff"/>
{svg_rects(rects)}
</svg>
"""
    (ROOT / "assets/favicon.svg").write_text(svg)
    print("assets/favicon.svg", len(rects), "rects")


# --------------------------------------------------------------------------
# og — 1200×630
# --------------------------------------------------------------------------
def og():
    w, h = 1200, 630
    band_y = 250
    band_h = h - band_y
    rects = wave_rects(w, band_h, 20)
    shifted = [(x, y + band_y, rw, rh, f, o) for (x, y, rw, rh, f, o) in rects]

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="Archivo, Helvetica Neue, Helvetica, Arial, sans-serif">
  <rect width="{w}" height="{h}" fill="#ffffff"/>

  <g font-size="13" letter-spacing="2.6" fill="#8b8b8b" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
    <text x="72" y="86">PORTFOLIO — MMXXVI</text>
    <text x="1128" y="86" text-anchor="end">PATNA, BIHAR — IN</text>
  </g>

  <text x="72" y="200" font-size="104" font-weight="600" letter-spacing="-3.6" fill="#0a0a0a">Aayushman Chandra</text>
  <text x="72" y="246" font-size="30" font-weight="500" letter-spacing="-0.6" fill="#6b7385">Designer &amp; developer — interface, brand systems, motion.</text>

{svg_rects(shifted)}

  <g font-size="13" letter-spacing="2.6" fill="#6b7385" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
    <text x="72" y="600">FIG. 01 — GENERATIVE WAVE · CELL 14PX</text>
    <text x="1128" y="600" text-anchor="end">AAYUSHMAN.DEV</text>
  </g>
</svg>
"""
    (ROOT / "assets/og.svg").write_text(svg)
    print("assets/og.svg", len(rects), "rects")


if __name__ == "__main__":
    favicon()
    og()
