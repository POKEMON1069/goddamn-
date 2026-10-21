# Working proof

Portfolio for **Nila Raghunathan**, a fictional independent designer and developer in Chennai.
The concept: every screen started as a sheet, and every sheet gets proofed. See `DESIGN.md` for
the brief, the concept card, the type and colour system, the layout plan and the QA decisions.

Stack: Next.js 15 (App Router, TypeScript), GSAP + Lenis for motion, self-hosted variable fonts,
static export-friendly, no WebGL.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | All copy, projects and placeholders. Start here to make it yours. |
| `src/styles/global.css` | Design tokens and every component style, in one file. |
| `src/styles/fonts.css` | Self-hosted Archivo + JetBrains Mono, with metric-matched fallbacks. |
| `src/lib/engine/` | Smooth scroll, page transitions, preloader, page motion, intro bus. |
| `src/components/` | Sections and controls. Content pages are `src/app/**`. |
| `public/images/` | Generated still lifes plus pre-sized webp sets (640/960/1440). |
| `scripts/images.mjs` | Regenerates the webp sets from the jpgs. |
| `scripts/qa.mjs` | Screenshot, axe, keyboard, hover, vitals and idle-motion audit. |

## Replacing the placeholders

1. `src/data/site.ts`: name, studio, email, social handles, projects, numbers, `site.url`.
2. `public/images/*.jpg`: drop your own stills in, run `node scripts/images.mjs`.
3. The contact form validates and confirms but posts nowhere. Wire `src/components/ContactForm.tsx`
   to a form endpoint or email service.
4. `src/app/layout.tsx`: canonical URL, OG image, JSON-LD already read from `site`.

## QA

```bash
npm run build && npm start -- -p 4400
CHROME_PATH=/path/to/chromium node scripts/qa.mjs        # writes .shots/
ONLY=home,contact node scripts/qa.mjs                    # one or two pages
```

Needs `puppeteer-core`, `axe-core` and `sharp` (dev dependencies) plus a Chromium binary.
