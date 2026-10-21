# Working proof — design record

Portfolio for **Nila Raghunathan**, independent designer and developer, Chennai.
Fictional persona, built as a portfolio template. Every project, client and number is a
placeholder and is flagged in `src/data/site.ts` and in the footer.

## Brief (inferred, no questions asked)

- **Subject:** an independent designer and developer who designs and builds, and who came out of
  a print shop.
- **Audience:** founder-led teams of 2 to 30 people, and design-literate peers.
- **Job of the site:** get shortlisted. The proof is the case studies and the craft of the page.
- **Constraints:** no assets supplied, so imagery is generated and marked as placeholder; English;
  a single developer, so the build stays server-rendered HTML plus a small motion layer.

## Concept card

```
Idea:        Every screen here started as a sheet, and every sheet gets proofed.
Metaphor:    A letterpress proof: ink ground, paper sheet, one vermilion second ink,
             registration marks, a counter, and a check pass.
Signature:   The press keeps one sheet on stage. Scrolling the three chapters pulls the
             proof through (sticky stage + red pull rule that fills with scroll).
Emotion:     Quiet, exact, tactile. The feeling of a good sheet in the hand at 3 seconds.
Motion verb: "pull" — sheets slide, presses flood, rules draw from the left. Nothing bounces.
             Idle: the registration mark in the nav breathes, 3.6 s, ±7°.
Screenshot:  The hero: three lines of display type, the third in vermilion, beside the
             photograph of a paper sheet curled through the press.
```

Alternatives considered and rejected:

1. **The grid as a material** (type and columns as the only imagery; motion = the grid
   reassembling). Originality 3, fit 3, portability 4. Rejected: it reads as a design-system
   demo, and it gives the visual work nowhere to live.
2. **The archive drawer** (each project as a physical card, pulled out and set down). Originality
   4, fit 3, portability 3. Rejected: it belongs to one of the four projects (Verdant) more than
   to the studio, and the interaction is a carousel with better manners.
3. **Working proof.** Originality 4, fit 5, feasibility 4, portability 2. Chosen: it comes from
   the subject's own history (print shop, then screens), it explains the working method the site
   sells, and it gives one signature moment that cannot be lifted onto someone else's portfolio.

## Genericness test

| Default the first draft would have used | What this site does instead |
|---|---|
| Centered hero over a gradient | Asymmetric 12-column hero, display type left, a lit still life right |
| Purple or teal accent | Vermilion `#e8471c`, the second ink on the press, used as a rule and a flood |
| Fade-up on every section | Line wipes on display type, sheet wipes on images, one sticky signature |
| Three equal service cards | A three-row editorial index with a registration mark that turns on hover |
| Cursor follower | Nothing follows the pointer; the work list pulls a real proof out to the side |
| Horizontal-scroll gallery as the idea | The press stage is vertical and additive; no scroll-jacking anywhere |

## Art direction

**Palette** (role → hex)

| Role | Value | Notes |
|---|---|---|
| ground (ink) | `#14130f` | Loader, proof stage, outcome, footer |
| ground soft | `#1d1b15` | Press interior |
| sheet (paper) | `#f4efe4` | Page ground |
| sheet deep | `#e9e2d3` | Row hover, confirmed form |
| muted | `#5c5749` | Secondary copy, 5.0:1 on paper |
| line | `#d3cabb` | Hairlines on paper |
| line ink | `#2e2b23` | Hairlines on ink |
| accent (vermilion) | `#e8471c` | Graphic rules, display-size colour, dots |
| accent text | `#b83410` | Small vermilion text on paper (5.2:1) and ink floods |
| accent on ink | `#ff6a3d` | Vermilion on the ink ground (6.5:1) |

Contrast measured: ink on paper 16.2:1, muted on paper 5.0:1, paper on accent-text 5.2:1,
accent-on-ink on ink 6.5:1.

**Type.** Archivo variable (self-hosted, 90 kB latin subset) for everything: display, body and
labels, at different widths and weights. JetBrains Mono (self-hosted, 40 kB) for indices,
metadata and labels. Display is set at 92 to 94% width, weight 540 to 580, tracking -0.035 to
-0.05em, leading 0.9 to 0.94. Body 16 to 18 px at 1.55 to 1.62. Small UI 11.5 to 14 px.

Fluid scale: display `clamp(2.9rem, 8.4vw, 8.6rem)`, h2 `clamp(2rem, 4.4vw, 4.1rem)`,
h3 `clamp(1.35rem, 2vw, 1.95rem)`, lead `clamp(1.05rem, 1.35vw, 1.32rem)`, body
`clamp(1rem, 1.02vw, 1.09rem)`.

**Grid.** 12 columns inside `max-width: 1680px`, page padding `clamp(1.125rem, 4.2vw, 4rem)`,
gutter `clamp(1rem, 1.6vw, 1.75rem)`. Alignment rule: everything hangs off the left page edge
except the index numbers (a fixed 3.5rem column in the work rows) and the last-column asides,
which are pushed to the right edge. Section rhythm varies on purpose: hero (asymmetric), stance
(title 7 cols, aside 4 cols offset), work index (full-width rows), press (sticky 6 / 5 split),
teaser (5 / 6 offset). No two consecutive sections share a layout family.

**Shape.** One radius rule: 2px, used only on buttons, chips, small labels and image frames.
No pills, no soft cards, no shadows except the floating proof.

**Motion language.** One family: `power2` to `power4` with `expo.inOut` for sheets (`--ease-lift`).
Small things 240 to 550 ms, pages 720 ms, the curtain 950 ms, the sheet wipe 1.35 s. Stagger 45 to
90 ms. Everything moves on GSAP's ticker; Lenis is the only smooth-scroll engine, driven by that
ticker. Hovers belong to CSS and reuse the same cubic-beziers.

**Composition plan**

```
HOME
┌──────────────────────────────────────────────┐
│ NAV  mark · name/role        index links  CTA│
├──────────────────────────────────────────────┤
│ kicker                       sheet 01 / proof │
│ SET IT WELL.                 ┌──────────────┐ │
│ PRESS IT ONCE.               │              │ │
│ THEN LOOK AGAIN. (vermilion) │   still life │ │
│                                 │            │ │
│ lede                            └──────────────┘
│ [CTA] [start a project ↗]      Fig. 01 caption
│ base/status/note meta strip (4 cols)          │
├──────────────────────────────────────────────┤
│ STANCE   title 7 cols            aside 4 cols │
│          big 3-line statement    paragraph +  │
│                                  numbered list│
├──────────────────────────────────────────────┤
│ WORK     label/intro            all work →    │
│ 01  Verdant Seed Library   disciplines  2025 ↗│
│ 02  Tally                  disciplines  2024 ↗│
│ ... rows flood from the bottom on hover        │
├──────────────────────────────────────────────┤
│ PRESS (ink)  title 6 cols   intro 5 cols      │
│  ch.1 sticky copy  │  ┌────────────────────┐  │
│  ch.2              │  │  pinned proof sheet │  │
│  ch.3              │  └────────────────────┘  │
├──────────────────────────────────────────────┤
│ TEASER   image 5 cols     heading + facts 6   │
├──────────────────────────────────────────────┤
│ FOOTER (ink)  next sheet / big CTA / 4 cols   │
└──────────────────────────────────────────────┘
```

Each inner page uses its own family: **Work** = alternating 7/5 cards; **Case study** = title and
meta table, full-bleed cover, brief 2-col, numbered approach, ink outcome band, next sheet with
image; **About** = copy 6 / facts 5 offset, 21:9 image, service index, 4-column process, FAQ
2-col; **Contact** = form 7 cols / details 4 cols offset; **404** = oversized "Misprint." with
an offset link stack.

## Content decisions

- Four projects, each with a constraint, a method and a consequence. Numbers are placeholders
  and every one is marked as such in the footer and on the work index.
- No client logos, no testimonials, no awards. Nothing that would need proof I do not have.
- Copy voice: first person, concrete nouns, short declaratives, no filler verbs.

## Signature moment: implementation and fallbacks

The press is a sticky stage, not a pinned one: the three chapters scroll normally on the left
while the proof plate on the right stays in view. One ScrollTrigger per chapter fires on toggle and
sets a single `active` index, which drives the plate crossfade and the "Proof 0n" stamp; a second,
scrubbed trigger fills the vermilion pull rule from the top of the track. There is no scroll
hijacking, the page scrolls at normal speed, and everything reads without it.

| Context | What happens |
|---|---|
| Desktop, motion on | Sticky plate, crossfade between three stills, scrubbed rule |
| Reduced motion | CSS only: strips become a single column, no sticky, all three plates listed with their chapters, rule static |
| Touch / narrow | Same single-column fallback as reduced motion (media query, not JS) |
| No JS | All three chapters and their images are in the HTML and visible; the plate is decorative (`aria-hidden`) |

## Continuity moments

1. **Loader.** Ink sheet, real loading (fonts + hero image), counter 000 to 100, minimum 620 to
   820 ms, hard cap 1.9 s, then the sheet lifts and the hero intro runs from the same moment.
   Skipped entirely under reduced motion and once per session.
2. **Page transition.** An ink sheet rises from the top edge (a proof being lifted), the route
   commits behind it, then it leaves upward. Reduced motion: instant, no curtain.
3. **Hero intro.** Nav items drop in, headline lines wipe up from their own masks, the still life
   wipes up from the bottom edge, then the lede and CTAs.

## QA decisions

- `DESIGN.md` records one deliberate departure: **no WebGL.** The concept is print, and a shader
  would be ornament. Depth comes from photography, ink floods and the sticky press.
- Idle motion is the nav registration mark. If it is ever removed, the site is still alive through
  hovers, but the idle check would fail, so it stays.

## Placeholders to replace before launch

1. The persona: name, email, social handles, city, availability, `site.url`.
2. All four projects (client, brief, numbers, outcomes) and their images.
3. The still lifes in `/public/images` (generated for this template).
4. The contact form has no backend; wire it to an email service or a form endpoint.
