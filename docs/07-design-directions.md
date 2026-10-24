# 07 — Three design directions

Each direction below is a different *art direction*, not a recolour of the same layout.
They were compared before any implementation code was written; the third was selected and
built.

---

## Direction A — "Instrument Panel"

**Concept.** The site behaves like a piece of studio equipment: a fixed measurement rail
down the left, monospaced readouts, a persistent parameter bar, hairline rules everywhere.
Projects are *modules* that can be switched like channels.

- **Type.** One technical grotesque for everything, with a mono for numerics. Headlines
  in uppercase with wide tracking.
- **Colour.** Near-black surfaces, phosphor-white text, a single amber signal colour.
- **Layout.** A left rail that never scrolls, a right "screen" that does. 8-column data
  grid; dense and justified.
- **Hero.** An empty instrument screen with a blinking cursor and one instruction.
- **Project presentation.** Switched panels in-place; no separate case-study pages.
- **Navigation.** Channel buttons (01, 02, 03) fixed in the rail.
- **Motion.** Stepped, mechanical: 80 ms linear transitions, no easing.
- **Mobile.** The rail collapses into a bottom control bar.
- **References.** XK Studio (2-item nav), Bruno Simon (site as demonstration), Rauno's
  Devouring Details (technical framing).
- **Risks.** Punishing to read long text; the dark technical register is *the* current
  portfolio cliché; hard to make accessible (thin type on dark); the "instrument" would
  read as costume rather than craft.

---

## Direction B — "Editorial Monograph"

**Concept.** A printed design monograph, translated faithfully: generous margins, a
serif that does the talking, plates with letterpress-style captions, footnote apparatus,
and a numbered contents page.

- **Type.** A high-contrast display serif (Scotch/Didone register) at very large sizes,
  a serif text face, no sans at all.
- **Colour.** Off-white paper, dense black, a single warm red used for rules and folios.
- **Layout.** 12-column grid with a wide outer margin reserved for captions and folios.
- **Hero.** The studio name set enormous, then a table of contents.
- **Project presentation.** Case studies as chapters with running heads and plate numbers.
- **Navigation.** A contents page; no persistent header.
- **Motion.** Almost none — page transitions only, ink-like fade.
- **Mobile.** Single column with folios moved inline; type scale reduced but not shrunk
  proportionally.
- **References.** Tiger Dingsun (index-as-identity), Brandon Yasin (editorial menu),
  Minimal Gallery's typographic lane.
- **Risks.** The crowded lane: "big serif + beige + whitespace" is the default portfolio
  look in 2026. Also weak at demonstrating *engineering* capability — it would have proved
  taste, not craft — and a no-header navigation costs usability.

---

## Direction C — "Instrument & Archive" *(selected)*

**Concept.** Two materials in tension: a **warm paper archive** (editorial typography,
rules, plates, folios) and a **dark instrument** (a live canvas plate, readouts,
parameters). The site's argument — *interface as instrument* — is literally what the
layout is made of. The paper half provides credibility and readability; the dark half
provides proof and memory.

- **Type.** **Fraunces** (variable: optical size, weight, SOFT, WONK) for display and
  italic emphasis; **IBM Plex Sans** for text; **IBM Plex Mono** for labels, numbers and
  metadata. A serif/sans pairing that is editorial without being a Didone cliché, and a
  mono that is genuinely technical rather than decorative.
- **Colour.** `#f2ece1` paper, `#17140f` ink, one accent `#b83a18` vermilion reserved
  for state, measurement and interaction; `#2a3266` ultramarine only appears inside
  imagery. Ink surfaces (`#14110c`) for the instrument band, footer and case-study
  signal sections.
- **Layout.** A 12-column grid with margin labels (`01 — Context`) and a field column;
  rules instead of cards; no shadows except one on the pointer preview.
- **Hero.** Type-led: the supplied sentence at display scale, an argument column, and a
  three-item footnote (practice / method / honesty about the demo). No image.
- **Project presentation.** A numbered index (rows, with a pointer preview) leading to
  four full case studies built on the same spine — context, constraint, decisions with
  trade-offs, craft, and *signals* instead of fake outcomes.
- **Navigation.** Work / Studio / Contact in the header, plus an "Index" overlay listing
  every destination — an editorial contents page that doubles as mobile navigation.
- **Motion.** Reveals at 620 ms on an ease-out curve; hover states 160–320 ms; one canvas
  with an explicit pause contract and a reduced-motion static frame. Nothing scales large
  objects on scroll.
- **Mobile.** Recomposed, not shrunk: the hero's side note stacks, the instrument becomes
  4:3 with a single-column control stack, index rows lose the year column, case-study
  modules stack label above body, the signal grid becomes one column.
- **References.** Tiger Dingsun (numbered index), Devouring Details (margin-label
  long-form), Brandon Yasin (one accent, scarce), XK Studio (minimal nav), Rauno (type-led
  hero), FIELD (row-with-preview), Henry Desches (marquee as texture).
- **Risks / trade-offs.**
  - Two material worlds can feel like two sites — mitigated by sharing one grid, one label
    system and one accent across both.
  - A live canvas is a performance and accessibility liability — mitigated by DPR cap,
    off-screen pause, `aria-hidden` canvas, native-range controls and a text fallback.
  - Hand-written CSS is a maintenance cost versus a utility framework — mitigated by
    tokens, BEM-lite naming and a single stylesheet entry with five ordered layers.

---

## Comparison against the brief

| Criterion | A — Instrument Panel | B — Editorial Monograph | **C — Instrument & Archive** |
| --- | --- | --- | --- |
| Audience fit (clients + hiring managers) | Technical only | Design-literate only | **Both: argument + evidence** |
| Proves design capability | Medium | High | **High** |
| Proves engineering capability | High (but simulated) | Low | **High (real component, audited)** |
| Readability / accessibility | Weak | Strong | **Strong** |
| Originality in 2026 | Low (dark technical is crowded) | Low (big-serif editorial is crowded) | **Medium-high (the two-world system is the differentiator)** |
| Implementation risk in this environment | High (no browser to test dark UI) | Low | Medium, mitigated by fallbacks |
| Content honesty | Easy to fake | Easy to fake | **Built around not faking (signals, demo markers)** |

**Selected: Direction C.** It is the only direction where the site's *form* proves its
claim, and where the paper half keeps a skeptical reader oriented while the instrument
half makes it memorable. Directions A and B each win on one axis and lose on the other;
C deliberately takes half of each and uses the tension as the identity.

## How the research produced this

- References 1–3 and 6–8 supplied the editorial grammar (label/field, index, one accent,
  type-led hero).
- The research report's finding that reviewers **skim for reasoning, not polish**
  produced the decision ledger and the "signals we would measure" sections.
- The Awwwards weighting (usability 30 %) and the web.dev vitals thresholds produced the
  performance and motion constraints *before* the visuals were designed.
- The common-weakness table produced the explicit anti-patterns: no preloader, no scroll
  hijacking, no fake metrics, no skill bars, no dead form.
