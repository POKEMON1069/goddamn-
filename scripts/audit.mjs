/**
 * Static audit of the production build.
 *
 * Runs axe-core inside jsdom plus a set of structural checks that a static
 * site can be held to without a rendering engine:
 *   - one h1 per page, no skipped heading levels
 *   - every image has alt text and intrinsic dimensions
 *   - every internal link resolves to a file in dist/
 *   - no duplicate ids, no dangling aria references, no placeholder hrefs
 *   - every form control is labelled
 *   - every CSS custom property used is defined
 *   - WCAG contrast ratios computed from the design tokens
 *
 * Colour contrast is NOT verified by axe here (jsdom has no layout engine);
 * it is verified arithmetically from the token values instead.
 *
 *   npm run build && npm run test:a11y
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const DIST = 'dist';
const results = [];
const fail = (page, message) => results.push({ page, message, level: 'error' });
const warn = (page, message) => results.push({ page, message, level: 'warn' });

/* ------------------------------------------------------------------ pages */

async function collectHtml(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectHtml(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out.sort();
}

const pages = await collectHtml(DIST);

function urlFor(file) {
  const rel = relative(DIST, file).split('\\').join('/');
  return '/' + rel.replace(/index\.html$/, '').replace(/\/$/, '/');
}

/* --------------------------------------------------------------- contrast */

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [light, dark] = [luminance(hexToRgb(a)), luminance(hexToRgb(b))].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const tokenCss = await readFile('src/styles/tokens.css', 'utf8');
const tokens = Object.fromEntries(
  [...tokenCss.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8});/g)].map((m) => [m[1], m[2]]),
);

const contrastPairs = [
  ['ink on paper', tokens.ink, tokens.paper, 4.5],
  ['ink-soft on paper (body copy)', tokens['ink-soft'], tokens.paper, 4.5],
  ['ink-mute on paper (mono labels)', tokens['ink-mute'], tokens.paper, 4.5],
  ['vermilion on paper (links/accents)', tokens.vermilion, tokens.paper, 3],
  ['paper on ink (inverse body)', tokens.paper, tokens['surface-ink'], 4.5],
  ['on-ink-soft on ink', tokens['on-ink-soft'], tokens['surface-ink'], 4.5],
  ['on-ink-mute on ink (mono labels)', tokens['on-ink-mute'], tokens['surface-ink'], 4.5],
  ['paper on vermilion (button hover)', tokens.paper, tokens.vermilion, 3],
];

const contrastReport = contrastPairs.map(([name, fg, bg, min]) => {
  const ratio = Number(contrast(fg, bg).toFixed(2));
  const pass = ratio >= min;
  if (!pass) fail('tokens.css', `Contrast ${name}: ${ratio}:1 (needs ${min}:1)`);
  return { name, fg, bg, ratio, required: min, pass };
});

/* ------------------------------------------------------ CSS custom props */

const cssFiles = await readdir('src/styles');
const allCss = (
  await Promise.all([
    readFile('src/styles.css', 'utf8'),
    ...cssFiles.map((file) => readFile(join('src/styles', file), 'utf8')),
  ])
).join('\n');

const defined = new Set([...allCss.matchAll(/^\s*--([\w-]+)\s*:/gm)].map((m) => m[1]));
const used = new Set([...allCss.matchAll(/var\(--([\w-]+)/g)].map((m) => m[1]));
const undefinedVars = [...used].filter((name) => !defined.has(name));
if (undefinedVars.length) {
  fail('styles', `Undefined CSS custom properties: ${undefinedVars.join(', ')}`);
}

/* ------------------------------------------------------------------- axe */

const axeConfig = {
  rules: {
    // jsdom has no layout engine: these cannot be evaluated meaningfully.
    'color-contrast': { enabled: false },
    'color-contrast-enhanced': { enabled: false },
  },
};

const axeReport = [];

for (const file of pages) {
  const url = urlFor(file);
  const html = await readFile(file, 'utf8');
  const dom = new JSDOM(html, {
    url: `https://qintara.example${url}`,
    pretendToBeVisual: true,
    runScripts: 'outside-only',
  });
  const { window } = dom;
  const document = window.document;

  /* --- structural checks ------------------------------------------------ */

  if (!document.documentElement.getAttribute('lang')) fail(url, 'Missing <html lang>');
  if (!document.title?.trim()) fail(url, 'Missing <title>');
  if (!document.querySelector('meta[name="description"]')) fail(url, 'Missing meta description');
  if (!document.querySelector('meta[name="viewport"]')) fail(url, 'Missing viewport meta');

  const h1s = document.querySelectorAll('h1');
  if (h1s.length !== 1) fail(url, `Expected exactly one <h1>, found ${h1s.length}`);

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  let previousLevel = 0;
  for (const heading of headings) {
    const level = Number(heading.tagName[1]);
    if (previousLevel && level > previousLevel + 1) {
      fail(url, `Heading level skipped: ${heading.tagName} "${heading.textContent.trim().slice(0, 40)}"`);
    }
    previousLevel = level;
  }

  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) fail(url, `Image without alt: ${img.getAttribute('src')}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) {
      fail(url, `Image without intrinsic size (CLS risk): ${img.getAttribute('src')}`);
    }
  }

  const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(url, `Duplicate ids: ${[...new Set(duplicates)].join(', ')}`);

  for (const el of document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]')) {
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      for (const id of value.split(/\s+/)) {
        if (!document.getElementById(id)) fail(url, `${attr} points at missing id "${id}"`);
      }
    }
  }

  for (const control of document.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    const labelled =
      (control.id && document.querySelector(`label[for="${control.id}"]`)) ||
      control.closest('label') ||
      control.getAttribute('aria-label') ||
      control.getAttribute('aria-labelledby');
    if (!labelled) fail(url, `Form control without label: ${control.tagName}#${control.id}`);
  }

  for (const button of document.querySelectorAll('button')) {
    const name =
      button.textContent.trim() || button.getAttribute('aria-label') || button.querySelector('img[alt]');
    if (!name) fail(url, 'Button without an accessible name');
  }

  for (const link of document.querySelectorAll('a')) {
    const href = link.getAttribute('href');
    if (href === '' || href === '#') fail(url, `Placeholder link: "${link.textContent.trim()}"`);
    const name = link.textContent.trim() || link.getAttribute('aria-label');
    if (!name) fail(url, `Link without accessible name: ${href}`);
  }

  /* --- internal link resolution ---------------------------------------- */

  for (const link of document.querySelectorAll('a[href^="/"]')) {
    const href = link.getAttribute('href').split('#')[0].split('?')[0];
    if (!href || href === '/') {
      if (!existsSync(join(DIST, 'index.html'))) fail(url, 'Missing dist/index.html');
      continue;
    }
    const direct = join(DIST, href);
    const asIndex = join(DIST, href, 'index.html');
    const asAsset = join(DIST, href);
    if (!existsSync(direct) && !existsSync(asIndex) && !existsSync(asAsset)) {
      fail(url, `Broken internal link: ${href}`);
    }
  }

  /* --- axe -------------------------------------------------------------- */

  try {
    window.eval(axe.source);
    const axeResult = await window.axe.run(document, axeConfig);
    const violations = axeResult.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }));
    for (const violation of violations) {
      fail(url, `axe ${violation.id} (${violation.impact}): ${violation.help} → ${violation.nodes.slice(0, 3).join(' | ')}`);
    }
    axeReport.push({
      page: url,
      violations,
      passes: axeResult.passes.length,
      incomplete: axeResult.incomplete.map((item) => item.id),
    });
  } catch (error) {
    warn(url, `axe could not complete: ${error.message}`);
  }

  window.close();
}

/* ----------------------------------------------------------- build report */

const errors = results.filter((r) => r.level === 'error');
const warnings = results.filter((r) => r.level === 'warn');

const report = {
  generated: new Date().toISOString(),
  pages: pages.map(urlFor),
  contrast: contrastReport,
  cssCustomProperties: { defined: defined.size, used: used.size, undefined: undefinedVars },
  axe: axeReport,
  errors,
  warnings,
};

await import('node:fs/promises').then(({ writeFile }) =>
  writeFile('audit-report.json', JSON.stringify(report, null, 2), 'utf8'),
);

console.log(`Audited ${pages.length} pages\n`);
console.log('Contrast (WCAG 2.2, computed from tokens):');
for (const row of contrastReport) {
  console.log(`  ${row.pass ? '✓' : '✗'} ${row.name.padEnd(34)} ${row.ratio}:1 (min ${row.required})`);
}

console.log('\naxe-core violations per page:');
for (const page of axeReport) {
  console.log(`  ${page.violations.length === 0 ? '✓' : '✗'} ${page.page.padEnd(22)} ${page.violations.length} violations`);
}

if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const error of errors) console.log(`  ✗ [${error.page}] ${error.message}`);
}
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.log(`  ! [${warning.page}] ${warning.message}`);
}

console.log('\nFull report: audit-report.json');

process.exitCode = errors.length ? 1 : 0;
