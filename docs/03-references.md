# 03 — Visual reference library

Fourteen references were inspected. "Inspected" below means I fetched the live site and
read its rendered text/DOM output, not a gallery thumbnail — except where marked
*thumbnail only*, because a site blocks automated access or is JS-only.

The last column is the important one: what was **reinterpreted**, not copied.

| # | Reference | Observed facts | Reinterpreted as |
| --- | --- | --- | --- |
| 1 | **Brandon Yasin** — <https://brandonyasin.com/> (Awwwards SOTD, 24 Oct 2026, 7.31/10) | Two-colour palette (`#505B44`, `#2C2922`); palette shifts with time of day and a draggable clock; navigation "unfolds like magazine covers"; archive as an image grid; About built from three principles (Empathy / Freedom / Growth) and a six-step process (See → Evolve); multi-step contact form capturing scope, format, budget, timeline. Built with Nuxt + GSAP + Sass per the Awwwards listing. | The idea that **one accent colour earns meaning by being scarce**; a process presented as a short numbered sequence; contact that asks about scope *before* the message. Rejected: time-of-day palettes (fragile, hard to test) and the "magazine cover" menu (too close to a signature move). |
| 2 | **Tiger Dingsun** — <https://tiger.exposed/> | Home is a **numbered index grouped by discipline** (Web 01–25, Graphic Design 01–19, Writing 01–10, Type Design 1–3), with a short About panel above it and a photo stream with one-line captions below. Extremely plain markup, no motion. | The numbered work index and the plainness of the list. The site's whole identity comes from **categorisation + honesty**, not from decoration. Directly informed the `.work-row` list and the "Index" overlay. |
| 3 | **XK Studio** — <https://xk.studio/> | Only two nav items (Work / Info). Work grid with three thumbnails per project that **scrub on hover**; video thumbnails from Mux; enormous whitespace. | Two-item navigation is enough when the work is strong. Informed the decision to keep the header to Work / Studio / Contact and put the long index behind one "Index" button. |
| 4 | **FIELD.IO** — <https://field.io/> | Statement headline ("Creative Intelligence for a Living World"), then a project list where each row reveals video stills on hover; heavy use of Cloudinary for responsive video. | Hover previews tied to an index row — implemented as a small, pointer-following plate that only exists on fine pointers. Rejected: full-bleed autoplaying video (bandwidth, reduced-motion complexity). |
| 5 | **Henry Desroches** — <https://henry.codes/> (repo: `xdesro/true-terrors`) | Very strong editorial voice; client names repeated as a marquee; sections for `now`, availability, contact, selected works with a "read the case study" link, then articles with category/tag/reading time. 11ty + Sass + Rollup + GSAP + Taxi page transitions. | The **marquee as a typographic texture** (used once, as a band of capabilities, `aria-hidden` and pausable). The "read the case study" affordance on each work row. Rejected: the maximalist dark aesthetic — it would have been an imitation, not a direction. |
| 6 | **Rauno Freiberg** — <https://rauno.me/> | A type-only hero that *is* the identity: "Rauno Freibergis an Estonianinteractiondesignerworking with Vercel", followed by a five-item list of projects and a descending "Make it fast / beautiful / consistent / careful / timeless / soulful / it." | The confidence to let a **sentence carry the hero** with no image. Also the idea that craft is expressed in a list of short principles. |
| 7 | **Devouring Details** — <https://www.devouringdetails.com/> | Long-form reference manual; explicitly designed as **two-column layouts for navigation through long content**, bite-sized scrollable chapters, 23 interactive React prototypes with downloadable source. | The two-column long-form pattern (label in the margin, argument in the field) — used for every case-study module in this build. |
| 8 | **Ueno** — <https://www.ueno.co/> | Huge statement ("Hi. We're a strategic design and innovation studio."), then client-name marquees, then a plain about block with awards listed as prose. | Client names as a marquee are **not available** to a fictional studio, so the marquee carries capabilities instead — an honest substitution. |
| 9 | **Bruno Simon** — <https://bruno-simon.com/> | A 3D world; the entire page text is "Interact / Unstuck". | Proof that a portfolio can be a single demonstration. Reinterpreted at a fraction of the weight: one canvas instrument instead of a WebGL world. |
| 10 | **Lynn Fisher** — <https://lynnandtonic.com/> | Versioned personal site ("v. XIX"), content rendered by JS, celebrated for yearly redesigns. | Versioning the build ("Build v2.0 — 2026") in the menu footer — a light nod, no imitation. |
| 11 | **Minimal Gallery** — <https://minimal.gallery/> | A curation layer, not a portfolio: tags for Portfolio / Personal / One page / Typographic / Grid layout. | Used as a **market survey**: one-page portfolios dominate; a multi-page editorial structure is a differentiator. |
| 12 | **Siteinspire** — <https://www.siteinspire.com/> | Category counts show the crowded lanes (Typographic 2,105; Portfolio 1,444; Unusual Layout 671). | Drove the decision to compete on *structure and interaction* rather than on a beautiful serif hero alone. |
| 13 | **Land-book** — <https://land-book.com/> | Separates Portfolio, Case Study, About, Contact page types; recently featured work is heavily Framer/Webflow template-driven. | Confirms the multi-page expectation (index + deep pages) and warns against template signatures — no card-grid-with-pill-buttons hero. |
| 14 | **Awwwards Portfolio category** — <https://www.awwwards.com/websites/portfolio/> | Current SOTD/Dev-award winners favour editorial menus, preloaders, case-study scroll narratives and unusual navigation. Evaluation weighting: Design 40 / Usability 30 / Creativity 20 / Content 10. | Took the "editorial menu" idea and the usability weighting; explicitly **rejected** the preloader (a delay before content is a usability cost). |

Also inspected but not used as a design reference (they informed the *decision not to*
follow a pattern): **Godly** failed to load, **Dribbble/Minimal Gallery** are thumbnail
layers with no interaction to study, and **Land-book's** trending pages are template
products rather than authored sites.

---

## What the references collectively changed

1. **Hero: type, not imagery.** References 1, 2, 6 and 8 all open with language, and the
   strongest portfolios in the set carry identity through typography. The hero therefore
   has no photograph; the photograph appears where it earns its place (work plates).
2. **The index is the navigation.** Reference 2 convinced me that a numbered list is
   both more honest and more scannable than a card grid — implemented as `.work-row`
   plus an "Index" overlay containing every destination.
3. **Margin labels, field arguments.** Reference 7's two-column long-form is the case
   study skeleton: `01 / Context` in the margin, the argument in the field.
4. **One accent.** Reference 1's two-colour discipline and Reference 3's restraint led to
   a palette of paper, ink and a single vermilion reserved for state and measurement.
5. **Small proof over big claims.** References 6 and 9 build credibility from a
   *demonstration*; here that is the live canvas instrument — the only element on the site
   that could not have been a screenshot.

## What was deliberately avoided

- Preloaders and intro animations (references 1, 14): a delay before content is a cost.
- Custom cursors and pointer-following distortion (common in the category): they exclude
  keyboard and touch users, and are hard to verify without a browser.
- Dark-mode-by-default with neon gradients — the exact visual signature of the original
  "Qintara" hero, and of a large share of current portfolios.
- Scroll-jacking / pinned horizontal sections: vestibular risk and a known usability
  failure mode, and I could not test it here.
