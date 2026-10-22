# DESIGN.md — GODDAMN- portfolio redesign

Produced following the `/awwwards`, `scroll-craft`, and "Build Awwwards-Quality Sites"
skills. Single source of truth for concept, art direction, motion, and assumptions so
later passes stay consistent. Stack: **Next.js 14 (App Router, TypeScript), GSAP +
Lenis, plain CSS with design tokens**. Chosen because the site is a content showcase
whose product is motion and typography — no app features, no CMS, no auth — so a static
App Router build gives the fastest first paint and easiest deploy (Vercel/Netlify/static
host). No external font requests (sandbox reaches only npm/github hosts), so the type
system is a self-contained system stack with display made active through scale and
negative tracking.

---

## Phase 0 — Brief

**Subject:** portfolio owner (name not provided) — defaulting per skill to "independent
designer & creative developer."
**Audience:** recruiters, clients, collaborators — people deciding whether to hire or
book the owner.
**Site's job:** get hired / get booked. Prove range and craft in ~3 seconds.
**Language:** English.
**Assets provided:** none. No logo, photography, type, or copy. All imagery is honest
typographic placeholder (marked `placeholder: true`) and all copy is placeholder until
the owner supplies real work.
**Constraints:** build entirely offline (no Google Fonts / Unsplash / image-gen network),
no fake credentials or invented metrics, no misleading client logos.

**Assumptions (explicit, replace before ship):**
- Owner name: `Alex Rivera` (`site.ownerName`, `placeholder: true`)
- Email: `hello@example.com` (`site.email`, `placeholder: true`)
- Location: `Patna, Bihar, IN` (`site.location`, `placeholder: true`)
- Socials: instagram/twitter/linkedIn `example` handles (`placeholder: true`)
- All 6 projects are fictional placeholders (`work[].fictional: true`) with typographic
  stand-in images — replace with real work and photography
- About bio is placeholder (`site.about.placeholder: true`)

---

## Phase 1 — Concept

Three concepts from different territories, scored 1–5 (originality, fit, feasibility,
portability — lower portability = more tied to this subject, better).

| # | Territory | Idea (one sentence) | Signature moment | Emotion | Frame to screenshot | Anchor | Orig | Fit | Feas | Port |
|---|-----------|---------------------|------------------|---------|---------------------|--------|------|-----|------|------|
| A | Profession's material (contact sheet / proof print) | Work laid out as frames on a film strip that rack into focus as you scroll | A pinned horizontal film strip scrubs with scroll; the frame nearest centre scales up and sharpens (rack focus) | Curiosity + precision | The hero film strip with one frame locked in the loupe | Designers own contact sheets / proofs | 4 | 5 | 5 | 2 |
| B | Name/etymology ("goddamn" as the "holy shit that's good" reaction) | Every interaction is an exclamation — bold, loud, punchy | A full-bleed accent flash on the first click/hover | Surprise | The accent flash filling the viewport | The site's own name | 2 | 3 | 4 | 5 |
| C | Formal/typographic system | Pure type, one family, extreme scale contrast, no imagery | Type that rebuilds itself word by word on scroll | Calm authority | A single enormous word against black | None (purely formal) | 3 | 4 | 5 | 5 |

**Picked: Concept A.** It's the only one anchored to a specific fact about the subject
(designers work with proofs and contact sheets), so it can't be moved to someone else
(portability 2). It also earns a loader and a signature moment per the brief's scale.

**Concept Card**
```
Idea:        A portfolio as a contact sheet — work laid out as film frames that rack
             into focus as you scroll.
Metaphor:    The designer's darkroom contact sheet / light table.
Signature:   Rack-focus film strip — scrolling scrubs a pinned horizontal strip; the
             frame nearest centre scales + clears + gets an accent border (GSAP +
             ScrollTrigger, `start: 'top top'`, `pin: true`).
Emotion:     Curiosity and precision — each frame invites you to lean in.
Motion verb: "rack focus" — slide into focus, settle, breathe at rest.
Screenshot:  Hero film strip with the centre frame magnified against the black ground.
```

---

## Phase 2 — Art direction system

**Palette (by role):**
- `ground` #0B0C0D — page ground (near-black, not pure)
- `ink` #F4F6F8 — primary text on ground
- `muted` #8A939D — meta, captions, secondary labels
- `line` #1A1E24 — borders, dividers, hairlines
- `accent` #FF2D55 — signal accent (the "goddamn" exclamation); text on accent is #000000
- `curtain` #000000 — loader/transition curtain (pure black, concept-justified: film leader)

Pure #000 / #fff used deliberately — the contact sheet demands deep blacks and clean
whites. Not an AI-default palette.

**Type (one family, two roles):**
- Display & text: system sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif`) — self-contained, zero external requests, no
  layout shift. Display is active through clamp() scale, tight negative tracking per
  size, and heavy weights. Body 17px / 1.55 leading; small UI 12–14px.
- Reason for no web font: sandbox cannot reach Google/Fontshare; system stack is the
  honest, performant choice. Owner may swap in a Fontshare/Google family via
  `next/font` in `src/app/fonts.ts`.

**Grid & rhythm:**
- 12-column implied, gutter `2.5vw`, inner max `1320px`, section padding `9vh` (7vh
  mobile). Every section uses a different layout family (hero = pinned film strip; work
  = 4-col grid → 1-col mobile; about = single wide column; case study = hero image +
  narrow text column). Alignment rule: everything flush-left unless the section calls for
  centre (never centre every act — scroll-craft rule).

**Shape:** one radius rule — `2px` (hairline, almost square).
**Motion language:** one easing family (GSAP expo / power4 / sine); big things slower
than small things; stagger 60ms; animate transform/opacity/clip-path only, never layout
props.

**Composition plan (ASCII wireframes):**

```
HOME
+---------------------------------------------------------------+
| nav        [GODDAMN-]      Work  About  Contact              |
+---------------------------------------------------------------+
|                                                              |
|  HERO (dimensional layered hero)                             |
|  bg plane: slow idle drift (idle motion at rest)             |
|                                                              |
|  "Contact sheet · Frame 01 of 06"                            |
|  GODDAMN-                                                    |
|  Independent designer & creative developer                   |
|  [See work]                                                  |
|                                                              |
|  +--+ +--+ +--+ +--+                                          |
|  |01| |02| |03| |04|   film strip (foreground plane)         |
|  |  | |  | |  | |  |   scrub with scroll, rack focus centre   |
|  +--+ +--+ +--+ +--+                                          |
|  "Scrub the strip · Click a frame"                            |
|                                                              |
+---------------------------------------------------------------+
|  Selected work (4-col grid → 1-col mobile)                   |
|  [card] [card] [card] [card]                                  |
+---------------------------------------------------------------+
|  footer                                                      |
+---------------------------------------------------------------+

CASE STUDY
+---------------------------------------------------------------+
| [badge]                                                       |
|  TITLE (large, max-width)                                     |
+---------------------------------------------------------------+
|  [full-bleed image plane]                                     |
+---------------------------------------------------------------+
|  narrow text column: summary + body + credits                 |
+---------------------------------------------------------------+
```

**Genericness test:** "If I gave a similar prompt to a generic model, would it land
here?" The pinned rack-focus film strip and contact-sheet metaphor are specific to a
designer's own process, so no. Changed anything generic: removed the "scroll to explore"
cue (scroll-craft bans it), removed eyebrow labels (at most one per three sections),
removed centered-copy-everywhere (varied the anchor), removed `01/06` counters (sequence
is not information — though the kicker shows "Frame N of M" as real info, which is
allowed).

---

## Phase 3 — Build notes

- Scaffold: manual Next.js 14 App Router + TS (official CLI avoided for offline
  determinism), `gsap` + `lenis`, no Tailwind (plain CSS tokens).
- Engine: `src/lib/scroll.ts` — one Lenis instance driven by GSAP's ticker (one clock),
  torn down on navigation. No raw scroll listeners, no `requestAnimationFrame` loops of
  our own.
- Pages: home (`/`), work (`/work`), case study (`/case/[slug]`, 6 prerendered), about
  (`/about`), designed 404 (`not-found.tsx`).
- Content: single source `src/data/site.ts` with `placeholder: true` flags.
- Loader: short (~1.6s) curtain + name reveal; skipped entirely under
  `prefers-reduced-motion`. Under 2.6s cap.
- Signature moment: rack-focus film strip in the hero (pinned, scrubbed, centre frame
  locked). Mobile: strip still present, shorter frames; signature not removed.
- Accessibility: skip link first focus stop, visible focus-visible, `aria-label` on
  film frames (role=button, keyboard activatable), one h1 per page, landmarks, lang,
  alt text on images, AA contrast, reduced-motion stripped.
- Images: honest typographic SVGs in `public/images/work/` + `og-image.svg`, all marked
  placeholder. Real `` via next/image with alt text; no fake div-based screenshots.

---

## Placeholders & assumptions to replace (before ship)

1. `src/data/site.ts` — `ownerName`, `email`, `location`, socials, about bio
2. `public/images/work/*.svg` — replace with real project photography
3. `public/sitemap.xml`, `public/robots.txt` — replace `https://example.com` with
   production domain
4. All 6 projects marked `fictional: true` — replace with real case studies
5. Consider swapping the system font stack for a Fontshare/Google family in
   `src/app/fonts.ts`

---

## QA status (to complete with the user)

- `npm run build` — passes, all 12 routes prerender, First Load JS ~146 kB
- Production server started and all routes return 200 (home, work, about, case study,
  404)
- Playwright / axe QA (`shoot.mjs`, `audit.mjs` from the `/awwwards` skill) could not
  be run in this sandbox (no Chromium / network-restricted). Run these against `npm run
  start` output before ship:
  - `npm run build && npx next start -p 4400`
  - `node $SKILL/scripts/shoot.mjs http://127.0.0.1:4400/ --crawl --nav`
  - `node $SKILL/scripts/audit.mjs http://127.0.0.1:4400/`
- Known QA item: hero copy (name/role) is inside a client component and hydrates after
  JS loads — measure mobile LCP; if over 2.5s, promote the hero name/role to server
  markup and keep only the filmstrip animation client-side.
- /jury self-score is not independent (I built the site). If a fresh critic is
  available, run `/jury <url>` on the deployed URL for an independent card.

---

## Ship checklist (Phase 5)

- [ ] Replace placeholders above
- [ ] Production URL in `next.config.js` / metadata (`site.url`, sitemap, robots)
- [ ] OG image at `/images/og-image.svg` (already present, SVG)
- [ ] Favicon at `/favicon.svg` (already present)
- [ ] Deploy (Vercel / Netlify / static host), user confirms before cutover
- [ ] Only then: optional `/jury <url>` independent re-score
