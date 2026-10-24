/**
 * Optional visual capture harness.
 *
 *   npm run dev          # in another terminal
 *   npm run test:visual  # writes .screenshots/*.png + report.json
 *
 * Requires a Chromium that can actually start in your environment. It could not
 * start in the original build sandbox (missing NSS/NSPR system libraries), so the
 * screenshots referenced in docs/10-verification.md were not produced. The script
 * is kept so the visual pass can be run where a browser is available.
 */
import { join } from 'node:path';
import {
  PAGES,
  VIEWPORTS,
  launch,
  newPage,
  goto,
  watchPage,
  issueSummary,
  ensureDir,
  saveJson,
} from './harness.mjs';

const OUT = '.screenshots';

const targets = [
  ...VIEWPORTS.map((viewport) => ({ page: PAGES[0], viewport, fullPage: true })),
  ...PAGES.slice(1).map((page) => ({ page, viewport: VIEWPORTS[2], fullPage: true })),
  ...PAGES.map((page) => ({ page, viewport: VIEWPORTS[0], fullPage: true })),
  { page: PAGES[8], viewport: VIEWPORTS[2], fullPage: false },
];

const results = [];

await ensureDir(OUT);

// A browser is optional. Fail with an explanation rather than a Puppeteer stack
// trace when the environment cannot start Chromium (e.g. missing NSS/NSPR,
// no display libraries, no sandbox permissions).
let browser;
try {
  browser = await launch();
} catch (error) {
  console.error('SKIPPED — could not start a browser in this environment.');
  console.error(`  reason: ${String(error.message || error).split('\n')[0]}`);
  console.error('  The visual pass is optional. Run this on a machine with a working');
  console.error('  Chromium (npm run dev in another terminal, then npm run test:visual).');
  console.error('  Accessibility and behaviour checks do not need a browser: npm test');
  process.exit(2);
}

for (const target of targets) {
  const page = await newPage(browser, target.viewport);
  const issues = watchPage(page);

  try {
    await goto(page, target.page.path);
    const name = `${target.page.name}--${target.viewport.name}`;
    await page.screenshot({
      path: join(OUT, `${name}.png`),
      fullPage: target.fullPage,
    });

    const metrics = await page.evaluate(() => ({
      title: document.title,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      headings: [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName}: ${h.textContent.trim().slice(0, 70)}`),
    }));

    results.push({
      name,
      path: target.page.path,
      viewport: target.viewport.name,
      ...metrics,
      issues: issueSummary(issues),
    });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.push({
      name: `${target.page.name}--${target.viewport.name}`,
      path: target.page.path,
      error: String(error.message || error),
      issues: issueSummary(issues),
    });
    console.log(`✗ ${target.page.name} (${target.viewport.name}): ${error.message}`);
  }

  await page.close();
}

// Reduced-motion pass on the home page.
{
  const page = await newPage(browser, VIEWPORTS[2], { reducedMotion: true });
  const issues = watchPage(page);
  await goto(page, '/');
  await page.screenshot({ path: join(OUT, 'home--reduced-motion.png'), fullPage: true });
  const revealed = await page.evaluate(
    () => document.querySelectorAll('[data-reveal]:not(.is-inview)').length,
  );
  results.push({
    name: 'home--reduced-motion',
    path: '/',
    viewport: 'laptop',
    reducedMotion: true,
    unrevealed: revealed,
    issues: issueSummary(issues),
  });
  await page.close();
}

// Menu overlay open state.
{
  const page = await newPage(browser, VIEWPORTS[2]);
  const issues = watchPage(page);
  await goto(page, '/');
  await page.click('[data-menu-toggle]');
  await new Promise((resolve) => setTimeout(resolve, 450));
  await page.screenshot({ path: join(OUT, 'home--menu-open.png') });
  results.push({
    name: 'home--menu-open',
    path: '/',
    viewport: 'laptop',
    menuOpen: await page.evaluate(
      () => document.querySelector('[data-menu]').dataset.open === 'true',
    ),
    issues: issueSummary(issues),
  });
  await page.close();
}

// Mobile menu overlay.
{
  const page = await newPage(browser, VIEWPORTS[0]);
  const issues = watchPage(page);
  await goto(page, '/');
  await page.click('[data-menu-toggle]');
  await new Promise((resolve) => setTimeout(resolve, 450));
  await page.screenshot({ path: join(OUT, 'home--menu-open--mobile.png') });
  results.push({
    name: 'home--menu-open--mobile',
    path: '/',
    viewport: 'mobile',
    issues: issueSummary(issues),
  });
  await page.close();
}

await browser.close();
await saveJson(OUT, 'report.json', results);

const problems = results.filter(
  (r) =>
    r.error ||
    r.overflowX ||
    r.issues.consoleErrors.length ||
    r.issues.pageErrors.length ||
    r.issues.failedRequests.length,
);

console.log(`\n${results.length} captures written to ${OUT}/`);
if (problems.length) {
  console.log('\nIssues found:');
  for (const problem of problems) {
    console.log(`- ${problem.name}: ${problem.error || 'see report.json'}`);
  }
  process.exitCode = 1;
} else {
  console.log('No console errors, failed requests or horizontal overflow detected.');
}
