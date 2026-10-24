# 05 — GitHub investigation

GitHub's API and raw file access were reachable (`api.github.com` returns 200). I
searched for portfolio implementations, interaction libraries and CSS systems, then read
the actual files rather than judging by stars.

## Selection method

Search used `portfolio creative developer in:name,description`, sorted by stars, then
filtered by three criteria: (a) the source is a *real published site*, not a template
marketplace entry; (b) the repository shows craft in structure or performance, not just a
screenshot; (c) the licence was identifiable.

## Shortlist and findings

### 1. `xdesro/true-terrors` — Henry Desroches' portfolio (site: henry.codes)

- **Licence:** `package.json` declares `"license": "ISC"`, but there is **no `LICENSE`
  file at the repository root** (verified via the contents API). ISC is permissive, but
  a missing licence file means the terms are ambiguous for substantial reuse. **No code
  was copied.**
- **Stack:** Eleventy 3 + WebC, Sass, Rollup, GSAP 3, `@unseenco/taxi` for page
  transitions, `@11ty/eleventy-img`, Stylelint (`stylelint-config-standard-scss`,
  `stylelint-selector-bem-pattern`, `stylelint-use-logical`).
- **What was learned:**
  - Responsive-image configuration is explicit and small: `formats: ['webp','jpeg']`,
    `widths: ['auto', 400, 800, 1400]`, `loading: 'lazy'`, `decoding: 'async'`,
    `sizes: '100vw'`. That is the pattern this build simplified into two widths per plate
    plus explicit `width`/`height`.
  - `stylelint-use-logical` enforces **logical CSS properties** — the same choice is made
    throughout `src/styles/` here (`inline-size`, `block-size`, `margin-block`,
    `padding-inline`) so the layout is writing-mode agnostic.
  - A BEM-ish class discipline keeps a hand-written stylesheet navigable; this build uses
    a lighter variant (`block__element` + `--modifier` only where a variant exists).
- **Not adopted:** the 40+ dependency footprint (GSAP, Taxi, dat.gui, simplex-noise,
  three separate build steps) is justified by that site's art direction, not needed here.

### 2. `darkroomengineering/lenis` — smooth scrolling

- **Licence:** MIT (LICENSE text read). ~16.8k stars, actively maintained (pushed the
  day of this review).
- **Finding:** it replaces native scroll with an interpolated transform loop.
- **Decision:** **not used.** It is well built, but for a static editorial site it delays
  scroll response, complicates `position: sticky`, and can conflict with
  `prefers-reduced-motion` and browser find-in-page. The category's smooth-scroll
  aesthetic was deliberately skipped in favour of native scrolling plus small reveals.

### 3. `argyleink/open-props` — CSS custom-property system

- **Licence:** MIT (LICENSE read: "Copyright (c) 2021 Adam Argyle").
- **Finding:** a very large, well-organised token system (colours in OKLCH/HSL, sizes,
  borders, aspect ratios, easings, animations) shipped as individual CSS files.
- **Decision:** **not installed**, but its *shape* informed `src/styles/tokens.css`:
  tokens grouped by role (colour → type → space → layout → border → motion), a documented
  spacing ramp, and named easings. Pulling in the whole system for one page set would have
  been several hundred unused properties.

### 4. Other repositories reviewed (and rejected)

| Repository | Licence | Why it was not used |
| --- | --- | --- |
| `eduuclopez/Polaris` (Astro portfolio template) | MIT | A polished template, but its layout is the category default; adopting it would have produced a template result. |
| `sleepyqadir/TechFolio` | none declared | No licence → not reusable. |
| `Arif-un/awesome-portfolio-websites` | MIT | A useful link list (used as a discovery index), not an implementation. |
| `Shamim-Al-Mamun/Modern-Portfolio-NextJS-Framer-Motion` | NOASSERTION | Ambiguous licence; Next.js + Framer Motion is heavier than this project needs. |
| `andymarrow/Stark` | NOASSERTION | Ambitious "industrial UI", but no clear licence and unverifiable visual claims from source alone. |
| `ibrahimmemonn/Figma-Portfolio` | none declared | No licence; Next.js + Tailwind default aesthetic. |

## What was actually reused

**No source code from any repository.** What travelled into this build is technique,
re-attributed here:

- responsive image practice and logical properties (true-terrors),
- token-system organisation (open-props),
- why *not* to adopt smooth-scroll hijacking (lenis),
- the general argument that a portfolio's own implementation is part of the evidence.

## Licensing summary

| Item | Licence | Obligation |
| --- | --- | --- |
| Fraunces (variable, self-hosted) | SIL OFL 1.1 | Keep the copyright notice; do not sell the font itself |
| IBM Plex Sans / Mono | SIL OFL 1.1 | Same |
| Vite | MIT | Attribution in dependency licences if distributed |
| `axe-core` (dev only) | MPL-2.0 | Dev tooling only, not shipped |
| jsdom / puppeteer-core / @sparticuz/chromium (dev only) | MIT / Apache-2.0 | Dev tooling only |
| This site's code | No licence file included | Add one before publishing |
