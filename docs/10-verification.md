# 10 — Verification report

Everything below was produced by running the commands in this repository. Nothing in this
document is a description of what "should" happen.

---

## 1. What was run

| Command | Scope | Result |
| --- | --- | --- |
| `npm run build` | 9 HTML entries → `dist/` | **Pass**, 376–385 ms |
| `npm run test:a11y` (`scripts/audit.mjs`) | axe-core in jsdom + structure, links, ids, ARIA, CSS variables, contrast | **Pass** — 9/9 pages, **0 violations**, 8/8 contrast pairs |
| `npm run test:behaviour` (`scripts/behaviour.mjs`) | 8 jsdom behaviour tests | **Pass** — 8/8 |
| `npm test` | build + audit + behaviour | **Pass** |
| `npm run test:visual` | puppeteer screenshots | **Skipped** — no browser can start here (see §5) |

### Build output

```
9 pages, ~385 ms
dist/assets/main-*.css   47.09 kB │ gzip 8.88 kB
dist/assets/main-*.js    12.55 kB │ gzip 4.98 kB
```

Pages emitted: `index.html`, `work/index.html`, `work/aperture/index.html`,
`work/longhand/index.html`, `work/signal/index.html`, `work/edge/index.html`,
`studio/index.html`, `contact/index.html`, `404.html`.

---

## 2. Accessibility and structure audit

`scripts/audit.mjs` loads each built page into jsdom, injects `axe-core`, and runs an
additional structural pass. Rules covered:

- **axe-core** — colour-contrast rule disabled (jsdom performs no layout, so contrast
  cannot be computed by axe; it is covered arithmetically instead — see §3).
- **Headings** — exactly one `h1`; no skipped levels.
- **Images** — every `<img>` has non-empty `alt` and both `width` and `height`.
- **Links** — every internal `href` resolves to a file in `dist/`; no `href="#"`.
- **Ids** — no duplicates; every `aria-labelledby` / `aria-describedby` / `aria-controls`
  target exists.
- **Form controls** — every input has an associated label.
- **CSS variables** — every `var(--x)` used in the stylesheets is declared; no silent
  fallbacks to an undefined token.
- **Contrast** — computed from the token values in `tokens.css`, per WCAG 2.2.

Result, 9/9 pages: **0 violations**.

The audit writes `audit-report.json` (git-ignored — it is a run artifact, regenerate with
`npm run test:a11y`).

---

## 3. Contrast, computed

| Pair | Ratio | Requirement | Verdict |
| --- | --- | --- | --- |
| ink on paper | 15.62 : 1 | 4.5 | pass |
| ink-soft on paper (body) | 9.59 : 1 | 4.5 | pass |
| ink-mute on paper (mono labels) | 8.23 : 1 | 4.5 | pass |
| vermilion on paper (links/accents) | 4.88 : 1 | 4.5 (3.0 for large) | pass |
| paper on ink (inverse body) | 16.02 : 1 | 4.5 | pass |
| on-ink-soft on ink | 11.12 : 1 | 4.5 | pass |
| on-ink-mute on ink | 11.59 : 1 | 4.5 | pass |
| paper on vermilion (button hover) | 4.88 : 1 | 4.5 | pass |

The weakest pair is vermilion at 4.88 : 1, which is why it is used for text only at body
size or larger, and for state (rules, rings, numbers) elsewhere.

---

## 4. Behavioural tests (8/8)

Run in jsdom against the real built markup and the real `src/main.js`, with a cache-busted
import per test so each mount starts clean.

```
✓ reveal fallback: without IntersectionObserver everything is visible
✓ menu: opens, traps focus, closes on Escape and restores focus
✓ navigation: current page is marked
✓ form: validation blocks empty submissions and reports errors
✓ form: valid input clears errors and prepares a mail draft
✓ copy button: reports a result instead of failing silently
✓ instrument: degrades to an explained fallback without canvas
✓ marquee: duplicated track is hidden from assistive technology
```

What each one actually asserts:

1. **Reveal fallback** — with `IntersectionObserver` deleted, no `[data-reveal]` element is
   left hidden; content is visible regardless of scroll.
2. **Menu** — toggling sets `aria-expanded`, removes `inert`, moves focus into the dialog,
   `Tab` wraps at the last item, `Escape` closes it and focus returns to the toggle.
3. **Current page** — the link matching `location.pathname` gets `aria-current="page"`
   and its nav rule opens.
4. **Form validation** — an empty submit sets `aria-invalid`, renders one message per
   field, associates it via `aria-describedby`, and does **not** navigate.
5. **Form draft** — valid input clears errors, writes a status line into the live region,
   and sets a `mailto:` draft — the status is written *before* navigation so a blocked
   mail client cannot swallow the confirmation.
6. **Copy button** — either the clipboard API path or the `execCommand` fallback reports
   "Copied" / an error in the status region; it never silently does nothing.
7. **Instrument fallback** — with `canvas.getContext` returning `null`, an explained text
   fallback is shown instead of an empty box.
8. **Marquee** — the duplicated visual track is `aria-hidden="true"`, so assistive
   technology reads the text once.

Bugs these tests found (all fixed in source, not in the test):

- the menu's focus restoration broke when nothing was focused before opening → added a
  fallback to the toggle;
- the form's status message was lost when `mailto:` navigation threw → status is now set
  first, navigation is wrapped;
- only the first `[data-instrument]` was initialised → now all instances are.

---

## 5. What could **not** be verified (honest limits)

### 5.1 No browser, therefore no pixel-level visual QA

Chromium could not be started in this environment. Attempts, all failed:

| Attempt | Outcome |
| --- | --- |
| Install a browser / system libs via `apt` | Package manager access blocked |
| Download a portable Chromium build | CDN unreachable (network allowlist) |
| Use the bundled `@sparticuz/chromium` binary | Cannot fork a renderer without NSS/NSPR |
| `--no-zygote --single-process` workarounds | Segfault |

`npm run test:visual` therefore exits with a clear **SKIPPED** message and code 2 rather
than a stack trace. **No screenshots exist for this build.** Any claim that the design
"looks right" at a specific viewport would be unverified.

Consequence: layout is verified *structurally* (correct elements, correct order, correct
token values, no overflow in the CSS contract), and via the CSS itself — but not
rendered. Specific unverified risks:

- Optical balance of the hero at 1440–1920 px (the display size is capped at 7rem for
  this reason, but the exact line breaks are unchecked).
- The pointer-following work preview at extreme pointer positions.
- Canvas rendering quality inside the 21:9 plate at 2× DPR.
- Touch behaviour of the range sliders on real iOS Safari.
- Font metric interactions after swap (a fallback stack is defined, so text does not
  reflow to zero height, but the swap shift is unmeasured).

### 5.2 No Lighthouse / CWV field or lab data

No browser means no Lighthouse, no LCP/INP/CLS measurement. The performance budget in
[09 — Architecture](09-architecture.md) is a *transfer-size and design* budget (totals from
the build output, no third-party requests, intrinsic image dimensions), not a measurement.

### 5.3 Pinterest was unreachable

Documented in [04 — Pinterest](04-pinterest.md): HTTP 403 plus a network-level block. No
Pinterest page was inspected, and no Pinterest-derived claim appears anywhere.

### 5.4 Real-device and browser-matrix testing

Not performed. Known exposures: `:has()` (used sparingly, with fallbacks), container-free
`clamp()` type scale, `@view-transition` (progressive — unsupported browsers simply
navigate), `inert` (Baseline 2023; jsdom supports it, older browsers get a non-trap menu
that still closes correctly).

### 5.5 No real content review

All copy is written for a fictional studio. No client, award, metric or testimonial is
real. The site says so in six places (hero footnote, every case-study hero, the menu
aside, the footer colophon, the studio page's "limits" block and the contact page).

---

## 6. Definition of done, against the brief

| Requirement | Status |
| --- | --- |
| Research with primary sources, including Pinterest / GitHub / Hugging Face | Done, with Pinterest and Hugging Face documented as unusable / unused |
| Three distinct design directions | Done ([07](07-design-directions.md)) |
| Design system with tokens | Done ([08](08-design-system.md), `tokens.css`) |
| IA and section plan | Done ([09](09-architecture.md)) |
| Multi-page build, real routing | Done — 9 static pages, prefetch-free but real URLs |
| Responsive composition per breakpoint | Implemented; unverified visually (§5.1) |
| Accessibility AA | Audited: 0 axe violations, contrast computed |
| Reduced motion | Implemented and tested (static frame, no reveals, marquee stopped) |
| No-JS fallback | Implemented and tested |
| Zero fabricated credentials / clients / metrics | Upheld throughout |
| Honest limitation reporting | This document |
| Documentation set | `docs/01`–`docs/10` |

**Remaining work before this is publishable:** the visual pass (§5.1) on a machine with a
browser, a real `LICENSE` file, a real email address in `content/site.json`, and removal of
the demo markers if the studio identity becomes real.
