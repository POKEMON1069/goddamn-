# 02 — Research report

Two kinds of evidence are kept apart below: **verified** (I read the primary source or
the live site) and **directional** (secondary reporting about hiring practice, which I
did not verify at the original source).

---

## A. What reviewers actually look for

| Finding | Evidence | Implication for this build |
| --- | --- | --- |
| Case studies are read for **context → problem → role → decision → reasoning**, not for finished screens. | designcase.app, "What Hiring Managers Look for in UX Case Studies" — primary source read: <https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/> | Every case study opens with context and constraints, then a **decision ledger** with the trade-off accepted. Screens are evidence, not the argument. |
| Strong portfolios present **3–5 deep studies**, not a long list. | myuxacademy, "UX Portfolio Guide" (2026): <https://myuxacademy.com/blog/ux-design-portfolio-guide/> and muz.li (2026) — both secondary/opinion | Four studies, all with the same spine; no half-finished extras, no "concept" filler. |
| Reviewers skim: **2–3 minutes** for a portfolio, **10–15 seconds** for a homepage. | muz.li, 2026 — secondary reporting; treat as directional | The first screen states the belief, shows proof (a working component one scroll away) and offers contact. The work index is scannable as a numbered list. |
| Specific language beats vague language ("retention 41 % → 53 %" vs "lift in retention"). | emilybackes.design, "What I actually look at in a portfolio review" — read: <https://emilybackes.design/post/what-i-actually-look-at-in-a-portfolio-review> | Concrete nouns and verbs throughout ("re-checked the same value four or five times"). Where no measurement exists, the site names the **signals it would watch** instead of inventing a number. |
| "Evidence of process and reasoning" outweighs visual quality in early screening (often quoted as 87 % vs 43 %, attributed to an NN/g 2024 survey). | Secondary reporting only (whennotesfly.com, citing NN/g). I did **not** access the NN/g survey itself. | Used as a directional argument for depth over gallery volume — **not** used as a statistic anywhere in the site. |

**Design consequence:** the portfolio's differentiator cannot be "nice case studies" —
most portfolios have those. It has to be *demonstrated capability*: a live, accessible,
performant component plus case studies that admit trade-offs.

---

## B. What the design-gallery layer rewards

Verified observations from the galleries themselves:

- **Awwwards' own evaluation weighting** — Design 40 %, Usability 30 %, Creativity 20 %,
  Content 10 % (from the SOTD page structure, read at
  <https://www.awwwards.com/sites/brandon-yasin>). Usability is not a rounding error, and
  content is weighted least: a **visually distinctive, usable** site is the target, not a
  content-heavy one.
- **Siteinspire's taxonomy** shows where the field clusters: Typographic 2,105 sites,
  Design & Art Direction 1,945, Portfolio 1,444, Minimal 847, Grid Layout 672,
  **Unusual Layout 671** (<https://www.siteinspire.com/>). The typographic/editorial
  register is crowded; genuinely unusual *composition* is rarer.
- **Land-book** separates `Portfolio` from `Case Study` as distinct page types
  (<https://land-book.com/design/portfolio>) — evidence that reviewers expect a work
  index *and* deep pages, not one or the other.
- **Minimal Gallery** curates on "beautiful & functional" and tags one-page vs personal
  sites (<https://minimal.gallery/>) — the one-page portfolio is the default, so a
  multi-page, editorially structured site is itself a differentiator.

**Design consequence:** avoid the crowded lane of "minimal beige portfolio with big serif
and lots of whitespace". Differentiate through *structure and interaction* — a numbered
instrument panel, measured rules, a live plate — while keeping the typographic control
that the category rewards.

---

## C. Web-platform requirements (verified at source)

| Requirement | Source | What was implemented |
| --- | --- | --- |
| Core Web Vitals thresholds: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1** at the 75th percentile. | web.dev, "Web Vitals" (updated 2024-10-31): <https://web.dev/articles/vitals> | All images declare intrinsic `width`/`height` (no CLS from media); two fonts preloaded; no blocking third parties; 12.5 KB JS (5 KB gzip) total. |
| `prefers-reduced-motion` is Baseline-wide (since Jan 2020); vestibular triggers include **scaling and panning large objects**. | MDN: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion> | No parallax or scroll-scaling of large objects. The instrument draws a **single static frame** under reduced motion; CSS transitions collapse; the marquee stops and wraps. |
| WCAG 2.2 success criteria (AA target). | W3C Quick Reference: <https://www.w3.org/WAI/WCAG22/quickref/> | Skip link, visible focus, 44 px touch targets for primary controls, labelled form fields with programmatic errors, `aria-current` on nav, no hover-only functionality (the work index is a list of links first; the preview is decorative). |
| Images need text alternatives; decorative content should be ignorable. | WCAG 2.2 SC 1.1.1 (same quick reference) | Descriptive `alt` on every plate; the canvas is `aria-hidden` with a text fallback; the marquee is `aria-hidden` with an equal-visibility heading elsewhere. |

Additional engineering decisions taken from platform constraints rather than fashion:

- **No animation library.** One `requestAnimationFrame` loop, cancelled off-screen and
  on `visibilitychange`; DPR capped at 2. A library would have added 20–40 KB to animate
  two shapes.
- **No web fonts from a CDN.** Self-hosted, subset to Latin, `font-display: swap`,
  preloaded. Removes a third-party connection and a privacy question.
- **No dark-mode toggle.** The design is one art-directed light surface with deliberate
  dark bands. A toggle would multiply the palette surface area for no benefit to the
  audience — and the "instrument" band already gives the contrast rhythm.

---

## D. Common weaknesses in portfolios (and what this build does instead)

| Observed weakness | Counter-decision |
| --- | --- |
| Hero is a screenshot of a project, with no point of view | Hero is the studio's argument in type; the first component appears immediately after it and is **real** |
| Case studies show only the final state | Each study names the constraint and the **trade-off cost** of its main decision |
| Decorative motion that fights reading | Motion is limited to reveals at 620 ms, hover states at 160–320 ms, and one canvas with a pause contract |
| Fake metrics / "increased engagement 42 %" with no basis | "Signals we would measure" — explicitly framed as things not measured, because the brief is fictional |
| Skill percentage bars | Capabilities described as work layers, each tied to something the site itself demonstrates |
| Contact form that silently does nothing | The form validates, then **composes a mail draft** and says so; the failure path is also handled |
| Accessibility retrofitted | Reduced motion, focus states, labels, alt text and touch targets were part of the token/component layer from the start, and are audited by script |

---

## Sources (all URLs preserved)

**Primary, read during research**
1. web.dev — Web Vitals: <https://web.dev/articles/vitals>
2. MDN — `prefers-reduced-motion`: <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>
3. W3C WAI — WCAG 2.2 Quick Reference: <https://www.w3.org/WAI/WCAG22/quickref/>
4. Awwwards — Portfolio category: <https://www.awwwards.com/websites/portfolio/>
5. Awwwards — Brandon Yasin SOTD page: <https://www.awwwards.com/sites/brandon-yasin>
6. Siteinspire — home and category counts: <https://www.siteinspire.com/>
7. Land-book — categories: <https://land-book.com/design/portfolio>
8. Minimal Gallery: <https://minimal.gallery/>
9. designcase.app — hiring-manager case-study expectations: <https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/>
10. emilybackes.design — portfolio review notes: <https://emilybackes.design/post/what-i-actually-look-at-in-a-portfolio-review>

**Secondary / directional (not verified at origin)**
11. myuxacademy — 3–5 case studies guidance: <https://myuxacademy.com/blog/ux-design-portfolio-guide/>
12. muz.li — 2026 review-time claims: <https://muz.li/blog/how-to-build-a-ux-portfolio-that-actually-gets-you-hired-2026/>
13. uxplanet — Context → Constraint → Decision → Trade-off → Outcome: <https://uxplanet.org/why-good-ux-portfolios-never-get-interviews-in-2026-11-hiring-red-flags-6ea28fb2f9b3>
14. whennotesfly — quoting an NN/g survey: <https://whennotesfly.com/work-skills/career-growth/how-to-build-a-ux-design-portfolio>

**Inaccessible** — Godly (<https://www.godly.website/>) failed to load in the sandbox;
Pinterest was blocked entirely (see [04 — Pinterest](04-pinterest.md)).
