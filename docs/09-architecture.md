# 09 — Technical architecture and information architecture

## 1. Stack decision

The existing repository was a single Vite page with hand-written CSS — useful work, and
the user asked for "whatever allows creative designs". Three options were considered:

| Option | Assessment |
| --- | --- |
| **Vanilla Vite + CSS** *(chosen)* | Direct control over the 12-column grid, typography and canvas; 12.5 KB JS / 5 KB gzip; no framework runtime; every animation is exactly the one specified. Cost: hand-written CSS scale, no component abstraction. |
| React + TypeScript | Familiar, but adds ~45 KB+ to render static prose, and would not change a single visual decision. |
| Astro + TS | Strong static output, but its content-collection machinery is unnecessary for 8 pages; a ~40-line Vite plugin covers the need. |

**Rendering:** static multi-page HTML at build time. No client-side routing, no hydration.
Every page ships complete markup; JavaScript is progressive enhancement only.

## 2. Build pipeline (custom, dependency-free)

`vite.config.js` adds one plugin (`qintara-html-compose`) with two responsibilities,
both running as `transformIndexHtml` (pre):

1. **Partials** — `<!-- @include partials/site-header.html -->` is expanded recursively
   (max depth 5, indentation preserved, missing file throws). Header, menu, footer and the
   pointer-preview element exist once.
2. **Content tokens** — `{{email}}`, `{{domain}}`, `{{url}}`, `{{repo}}`, `{{year}}` are
   replaced from `content/site.json`. An unknown token **fails the build**, which is what
   makes "edit contact details in one file" a guarantee instead of a convention.

Multi-page inputs are declared explicitly in `rollupOptions.input` (8 pages incl. 404), so
there is no directory-scanning magic.

CSS is one entry (`src/styles.css`) `@import`ing five ordered layers; Vite inlines them
into a single 46 KB stylesheet (8.8 KB gzip). Fonts and plates are hashed by Vite.

## 3. Module structure

```
src/main.js            boot() → initMenu, initCurrentPage, initReveals, initHeaderState,
                       initWorkPreview, initCopyButtons, initContactForm, initClocks,
                       createInstrument × N
src/js/instrument.js   createInstrument(root, {reduceMotion}) — self-contained; owns its
                       canvas, controls, observers and lifecycle
```

`main.js` never queries beyond what it needs; each initialiser exits early if its target
is absent, so one script serves all eight pages. `createInstrument` is instantiated for
every `[data-instrument]` on the page (home and the Aperture case study).

## 4. Information architecture

```
/                     Home
├── #instrument       Live component (proof)
├── #position          Belief
├── #work              Work index (4 rows + pointer preview)
├── #capability        Five capabilities
├── #method            Three moves
└── studio teaser      Ink band, links to /studio/
/work/                Work index — cards + numbered list
/work/{aperture,longhand,signal,edge}/
                      Case studies (hero → plate → 01 Context → 02 Constraint →
                      03 Decisions → 04 Craft → 05 Signals [ink] → next case)
/studio/              Position · Principles · Method · About this build · Limits
/contact/             Email + copy · what happens next · mail composer
/404.html             Not found
```

Rationale: the work index is reachable from the header on every page; each case study ends
with the next one, so the four studies form a loop rather than a dead end; the studio page
carries the honesty statement and the limits, so the marketing surface does not have to.

## 5. Section plan (purpose → content → behaviour)

| Section | Purpose | Content | Interaction | Responsive | A11y |
| --- | --- | --- | --- | --- | --- |
| Header | Orientation | Brand, Work/Studio/Contact, CTA, Index | Sticky; backdrop after 8 px scroll; `aria-current` | Nav hidden < 1024 px, CTA hidden < 600 px | `<nav aria-label="Primary">`, 44 px targets |
| Index overlay | Full map | 8 numbered destinations + enquiries + build note | Modal dialog, focus trap, Escape, `inert` when closed, scroll lock | One column, scrollable | `role="dialog" aria-modal`, labelled, focus restored |
| Hero | State the belief fast | Display sentence, lead, two actions, side note, 3-item footnote | CSS entrance only | Side note stacks below | Single `h1`, decorative full stop `aria-hidden` |
| Instrument | Prove capability | Live canvas, readout, mode + 2 params, notes, case link | Drag inside plate; native ranges; pause off-screen; static under reduced motion | 21:9 → 4:3; controls 3-col → 1-col | Canvas `aria-hidden`, sliders labelled with `aria-valuetext`, text fallback |
| Position | Differentiate | Manifesto statement + aside | Reveal | Statement stacks | No fabricated claims |
| Work index | Route to evidence | 4 rows: number, title, discipline, year | Pointer-following preview (fine pointers only); rows are plain links | Year hidden < 1200 px; meta wraps < 768 px | Hover is decorative; link text is the title |
| Capability | Explain scope | 5 ledgers with tags | Reveal | 4-col → stacked | Real `h3`s |
| Method | Show process | 3 steps + a plate | Reveal | 3-col → 1-col | Figure with caption |
| Teaser | Personality | Copy + plate on ink | Reveal | Stacks | Ink contrast tokens |
| Case study | Evidence of judgement | Hero facts, plate, 5 modules, decision ledger, pull quote | Reveal; live component on Aperture | Labels stack above body < 1200 px | `h2` per module, `dl` for facts |
| Contact | Remove friction | Email + copy, expectations, form | Validation → mailto draft; status live region | Two columns → stack | Labels, `aria-invalid`, `aria-describedby`, live status |
| Footer | Navigation + provenance | CTA, index, cases, colophon, clock, source | Reveal-free | 2-col meta → left-aligned | Ink tokens, real links only |

## 6. Metadata and SEO

- Unique `<title>` and `<meta name="description">` per page; canonical URLs from
  `content/site.json`.
- Open Graph + Twitter card per page, with page-specific social images in `public/og/`
  (1200×630) — absolute URLs at build time.
- `lang="en"`, one `h1`, descriptive link text, no keyword stuffing.
- `404.html` is `noindex`.
- No structured data: inventing `Organization` markup for a fictional studio would be a
  false claim (revisit once the identity is real).

## 7. Performance

| Budget | Result |
| --- | --- |
| HTML | 8.7–29 KB (2.2–6.3 KB gzip) |
| CSS | 46 KB (8.8 KB gzip), one request |
| JS | 12.5 KB (5.0 KB gzip), one request, `type="module"` |
| Fonts | 375 KB total, 2 preloaded, `font-display: swap`, Latin only |
| Images | 8–188 KB WebP, lazy below the fold, intrinsic dimensions everywhere |
| Third-party requests | **0** at runtime |
| CLS sources | none known: all media has dimensions; no injected banners; no late-loading fonts above a swap-safe fallback |

Canvas work is bounded: one `requestAnimationFrame` loop, DPR ≤ 2, paused when off-screen
or the tab is hidden, cancelled on `visibilitychange`.

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Two visual worlds feel like two sites | Shared grid, label system and accent; ink bands are used as rhythm, not a second brand |
| Canvas accessibility | Canvas is decorative only; native ranges carry the state; fallback text if 2D context is unavailable |
| Hand-written CSS drifts | Tokens only; ordered layers; `undefined custom property` check in the audit |
| Content duplication across pages | Partials + a single content JSON; unknown tokens fail the build |
| Missing visual regression testing | Documented limitation; `scripts/visual.mjs` is ready for an environment with a browser |
| Fictional content mistaken for real work | Demo markers on every case study, in the hero footnote, the footer colophon, the menu aside and the studio page |

## 9. Deployment checklist

1. `npm ci && npm run build`.
2. Set `url` in `content/site.json` to the production origin; rebuild (canonical + OG).
3. Replace `email` (and remove the demo markers) if the studio is real.
4. Serve `dist/` with a 404 fallback to `404.html`.
5. Cache `/assets/*` immutably; HTML `no-cache`.
6. Add a `LICENSE` file for the code before publishing.
