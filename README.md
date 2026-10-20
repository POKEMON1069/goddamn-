# Aayushman Chandra — Portfolio

A one-page portfolio built from the **Wild** design system (`craft.wild.as`):
Swiss grid, extreme white space, heavy display type, and a **generative
pixel-art wave** rendered live on `<canvas>`.

No build step, no framework, no dependencies. Three files do the work —
`index.html`, `assets/css/style.css`, `assets/js/*.js`.

---

## Run it

```bash
python3 -m http.server 3000
# → http://localhost:3000
```

Any static server works (`npx serve .`, `php -S localhost:3000`, VS Code Live
Server). Opening `index.html` straight from the file system also works — the
scripts are classic (non-module) scripts on purpose.

## Structure

```
index.html                 page + all copy (edit this for content)
DESIGN.md                  the Wild design system + how this repo adapts it
assets/
  css/style.css            tokens first, then sections (numbered 00–18)
  js/wave.js               the generative pixel wave (also draws thumbnails)
  js/app.js                marquees, clock, theme, reveals, work preview
  fonts/                   Archivo Variable, self-hosted (SIL OFL 1.1)
  favicon.svg              generated — 16×16 pixel wave
  og.svg                   generated — 1200×630 social card
tools/make-graphics.py     regenerates favicon.svg + og.svg from the wave maths
```

## The wave

`assets/js/wave.js` — a heightfield of four summed sines, sampled on the
source's `--cell: 14px` grid, quantised into six flat colour bands, with a
static hash dither so the crest breaks into pixels instead of a smooth curve.
Three layers (soft / mid / full) composite back to front so the mass reads as
depth, and the crest row is picked out in neon `#d8ff00`.

It is drawn in whole device pixels (no `ctx.scale`), pauses when off-screen or
when the tab is hidden, and holds a single still frame for
`prefers-reduced-motion`. The same renderer draws the seeded per-project
thumbnail that follows the cursor over the work list.

Regenerate the static art after changing the algorithm:

```bash
python3 tools/make-graphics.py
```

## Design tokens

Source tokens are kept verbatim as CSS custom properties (`--paper`, `--ink`,
`--neon`, `--mono`, `--maxw: 1176px`, `--gutter: 56px`, `--cell: 14px`,
`--readw: 34ch`) at the top of `style.css`. Two deliberate adaptations:

- **Type**: the source's *Sneak* is commercial, so **Archivo Variable** is
  self-hosted instead — a grotesque with both `wght` and `wdth` axes, used
  expanded (`font-stretch: 108%`) for the marquee.
- **Spacing**: the detected scale (14 / 35 / 98 / 126 / 168) is a **7px** grid,
  so it's kept as `--u: 7px` rather than rounded to 4/8/16.

Dark mode is an inverted token set on `:root[data-theme="dark"]`, remembered in
`localStorage` and defaulted to `prefers-color-scheme`.

## Before you ship — replace the placeholders

Everything marked `TODO` in `index.html`:

```bash
grep -n "TODO" index.html
```

| What | Where |
|---|---|
| Email address (`hello@aayushman.dev`) | contact section + og/social links |
| Social handles (X, LinkedIn, Instagram currently point at bare domains) | contact section |
| Project links (all six point at `github.com/POKEMON1069`) | `data-href` on `.work__row` |
| Project copy, years and tags | `.work__row` blocks |
| Bio, availability window, stack list | hero + about |
| `og:image` domain (currently a relative path) | `<head>` |

Project thumbnails are generated, not uploaded — change `data-seed` on a row to
get a different one.

## Deploy

The repo root *is* the site, so GitHub Pages works with zero config:
**Settings → Pages → Deploy from branch → `main` / `/ (root)`**.

## Credits

- Design system extracted from [craft.wild.as](https://craft.wild.as) via
  [Inspo](https://github.com/Nutlope/inspo) (MIT).
- [Archivo](https://github.com/Omnibus-Type/Archivo) by Omnibus-Type, SIL Open
  Font License 1.1 — see `assets/fonts/OFL.txt`.
