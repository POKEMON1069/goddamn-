# 08 — Design system

Every value here exists in `src/styles/tokens.css` and is consumed by role. Nothing in
the components is hard-coded except the canvas palette, which is documented in
`src/js/instrument.js`.

## 1. Colour roles

| Token | Value | Role | Contrast |
| --- | --- | --- | --- |
| `--paper` | `#f2ece1` | Page surface | — |
| `--paper-deep` | `#e8e0d1` | Instrument chassis, secondary surface | — |
| `--paper-shade` | `#ddd4c2` | Media placeholder behind plates | — |
| `--ink` | `#17140f` | Primary text, rules at 16 % | **15.6 : 1** on paper |
| `--ink-soft` | `#5b5446` | Body copy, secondary prose | **9.6 : 1** |
| `--ink-mute` | `#6b6455` | Mono labels, captions | **8.2 : 1** |
| `--vermilion` | `#b83a18` | Interaction, state, measurement — only these | **4.9 : 1** |
| `--ultramarine` | `#2a3266` | Reserved for imagery / future data series | n/a |
| `--surface-ink` | `#14110c` | Instrument, signals band, footer | — |
| `--on-ink` | `#f2ece1` | Text on ink | **16.0 : 1** |
| `--on-ink-soft` | `#cfc6b5` | Body on ink | **11.1 : 1** |
| `--on-ink-mute` | `#9d9483` | Labels on ink | **11.6 : 1** |

Rules: `--rule` (`rgba(23,20,15,.16)`) for hairlines, `--rule-strong` (`.42`) for
structural rules and control borders, `--rule-ink` / `--rule-ink-strong` for the inverse
surface.

**The accent rule.** Vermilion appears only where the interface is telling you something
about state: the active nav rule, focus rings, the instrument's highlight ring, signal
numbers, demo markers, and the full stop of the hero sentence. It is never used for
decoration or a second background. This is why it still reads as a signal on a page with
seven sections.

`prefers-contrast: more` raises the two soft text colours and the rule alphas.

## 2. Typography

| Role | Family | Size | Notes |
| --- | --- | --- | --- |
| Display | Fraunces Variable | `clamp(2.6rem, 6.6vw, 7rem)` | `opsz 144, SOFT 24, WONK 1, wght 380`; line-height 0.94; tracking −0.028em; max 22ch |
| H1 (case/contact) | Fraunces | `clamp(2.5rem, 6vw, 5rem)` | `opsz 144`, line-height 0.96–0.98 |
| H2 | Fraunces | `clamp(1.85rem, 3.4vw, 2.9rem)` | `opsz 144, SOFT 12, WONK 0, wght 420` |
| H3 | Fraunces | `clamp(1.2rem, 1.65vw, 1.5rem)` | Section sub-heads inside modules use mono instead |
| Lead | IBM Plex Sans | `clamp(1.05rem, 1.35vw, 1.28rem)` | line-height 1.5, max 62ch |
| Body | IBM Plex Sans | 1.0625rem (17px) | line-height 1.62 |
| Small | IBM Plex Sans | 0.875rem | captions, notes, form copy |
| Mono label | IBM Plex Mono | 0.75rem | uppercase, tracking 0.14em |
| Italic emphasis | Fraunces Italic | inherits | `opsz 120, SOFT 40, WONK 1, wght 340` |

Measure: `--measure: 62ch` for prose, `--measure-narrow: 46ch` for asides. The display
size is deliberately capped at **7rem**, not 9rem: at 1440 px the hero's 12-column
measure is ~1296 px, and 7rem keeps the headline at three lines. (The first draft used
9.6vw and would have broken the hero into seven lines — corrected before build.)

Fonts are self-hosted (Fraunces latin full-axis + italic; Plex Sans 400/500/600; Plex Mono
400/500), `font-display: swap`, Latin subset, with the display face and body regular
preloaded. Total font payload ≈ 375 KB, but only the used faces load.

## 3. Space and grid

- Spacing ramp on a 4/8 px rhythm: `0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 · 12 rem`.
- `--section-pad: clamp(4.5rem, 10vw, 9rem)` — vertical rhythm between bands.
- `--gutter: clamp(1rem, 2.6vw, 2.5rem)`; `--page-pad: clamp(1.15rem, 4.6vw, 4.5rem)`.
- Shell max width **1560 px**, so a 1920 px display gets real margins rather than a
  stretched 12-column grid.
- **12-column grid** on desktop, 6 on tablet and below. `.grid`, `.section-head`,
  `.module`, `.split`, `.case-hero__inner`, `.hero__base`, `.instrument-band`,
  `.capability`, `.teaser` all share the same column maths.
- Margin-label pattern: label in columns 1–3, argument in 4–11, aside in 11–12.

## 4. Breakpoints

| Token | Width | Composition change |
| --- | --- | --- |
| `sm` | ≤ 599 px | Header CTA hidden; brand + Index only |
| `md` | ≤ 767 px | 6-column grid; index rows drop meta to a second line; case modules stack; signals become one column; instrument 4:3 |
| `lg` | ≤ 1023 px | Primary nav hidden → Index overlay; all 12-col splits stack; instrument band stacks copy above plate |
| `xl` | ≤ 1199 px | Work rows drop the year column; case module labels stack above body |
| `2xl` | > 1600 px | Shell caps at 1560 px; type stops scaling |

## 5. Components and states

| Component | Default | Hover | Focus-visible | Active / open |
| --- | --- | --- | --- | --- |
| Primary button | ink fill, paper text | vermilion fill | 2 px vermilion outline, 3 px offset | — |
| Ghost button | transparent, strong rule | vermilion fill + border | same outline | — |
| Header nav link | `--ink-soft` | `--ink` + rule grows from left (scaleX) | outline | `aria-current="page"`: rule at full width |
| Index row | rule-separated, 3-col grid | title arrow fades in, index turns vermilion, preview plate appears | outline | — |
| Menu link | on-ink, 4rem display | translates 1.25rem + warm tint | outline | `aria-expanded` on toggle; `inert` when closed |
| Range | 1 px track, 13.6 px vermilion thumb | thumb scales 1.25 | outline offset 6 px | `aria-valuetext` updated |
| Segmented control | rule box, mono labels | paper-shade fill | outline | `aria-pressed="true"`: ink fill |
| Form field | 1 px strong rule | darker border | 2 px vermilion | `aria-invalid` + vermilion border + message |
| Link with arrow | underline rule | rule + text vermilion, arrow slides 0.3rem | outline | — |
| Copy button | ghost | vermilion | outline | label swaps to "Copied" for 2.2 s, status announces |

Radii: 2 px (inputs, buttons, tags), 3 px (panels), pill only for the brand dot and tags.
**No ambient shadows**; one soft shadow on the pointer preview only. Separation comes from
rules and space.

## 6. Motion

| Token | Value | Applied to |
| --- | --- | --- |
| `--dur-1` | 160 ms | colour, border, thumb scaling |
| `--dur-2` | 320 ms | arrows, menu fade, button state |
| `--dur-3` | 620 ms | reveals, first-paint rise |
| `--dur-4` | 1100 ms | plate image scale on hover |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | everything entering or expanding |
| `--ease-inout` | `cubic-bezier(.65,0,.35,1)` | reserved |

Rules:

- Above-the-fold content animates from CSS (`@keyframes rise`), so the hero is never blank
  waiting for JavaScript.
- Below-the-fold reveals are one `IntersectionObserver`; each element is unobserved after
  it fires.
- Nothing scales or pans a large object on scroll (vestibular risk, per MDN).
- Under `prefers-reduced-motion: reduce`: reveals are visible immediately, the hero does
  not animate, the marquee stops and wraps (`aria-hidden` duplicate removed), the
  instrument draws one static frame, and cross-document view transitions are disabled.
- Multi-step stagger is `90 ms` (`--i`), never more than four steps.

## 7. Accessibility requirements (enforced, not aspirational)

1. Contrast: all text pairings ≥ 4.5 : 1 (large ≥ 3 : 1) — computed from tokens in
   `scripts/audit.mjs`, not eyeballed.
2. Exactly one `h1` per page; no heading level skipped (audited).
3. Every image has `alt` plus intrinsic `width`/`height`; decorative graphics are
   `aria-hidden`.
4. Every control has an accessible name; the menu is a labelled modal dialog with a focus
   trap, `Escape`, and focus restoration to the trigger.
5. Form errors are programmatically associated (`aria-describedby`), announced in a live
   region, and focus moves to the first invalid field.
6. No functionality depends on hover: work rows are links; the preview is decorative.
7. Focus ring: 2 px vermilion on paper, paper on ink, never removed.
8. Touch targets: 44 px minimum for header controls, buttons and range thumbs.
9. Content is readable and navigable without JavaScript (verified by removing the `js`
   class: controls that need JS are hidden, navigation falls back to the visible header
   and the full footer index).
10. Keyboard: all interactive elements reachable in DOM order; the canvas is not a
    control — the native ranges are.

## 8. Content voice

Rules used while writing: concrete nouns; no adjectives doing the work of evidence;
declare the trade-off; never claim a measurement that was not taken; use "would" for
hypotheticals; explain the demo status once per surface, not in every paragraph.
