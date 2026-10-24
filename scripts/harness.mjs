import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const BASE = process.env.BASE_URL || 'http://localhost:5173';

export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work/' },
  { name: 'aperture', path: '/work/aperture/' },
  { name: 'longhand', path: '/work/longhand/' },
  { name: 'signal', path: '/work/signal/' },
  { name: 'edge', path: '/work/edge/' },
  { name: 'studio', path: '/studio/' },
  { name: 'contact', path: '/contact/' },
  { name: '404', path: '/does-not-exist/' },
];

export const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 834, height: 1112, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'laptop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'wide', width: 1920, height: 1200, deviceScaleFactor: 1 },
];

// If a Chromium build in your environment is missing NSS/NSPR, point
// LD_LIBRARY_PATH at a directory containing them before running the harness.
// (The original build sandbox could not do this; see docs/10-verification.md.)

export async function launch() {
  const executablePath = await chromium.executablePath();
  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--font-render-hinting=none',
      '--disable-lcd-text',
      '--force-color-profile=srgb',
    ],
    executablePath,
    headless: 'shell',
    defaultViewport: null,
  });
}

export async function newPage(browser, viewport, { reducedMotion = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reducedMotion) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  return page;
}

/** Collects console errors, page errors and failed network requests. */
export function watchPage(page) {
  const issues = { consoleErrors: [], pageErrors: [], failedRequests: [], badResponses: [] };

  page.on('console', (message) => {
    if (message.type() === 'error') issues.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => issues.pageErrors.push(String(error.message || error)));
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    issues.failedRequests.push(`${request.url()} — ${failure ? failure.errorText : 'unknown'}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      issues.badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  return issues;
}

export async function goto(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0', timeout: 45_000 });
  // Let fonts settle and reveal animations finish before capture.
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight * 0.8;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else {
          window.scrollTo(0, 0);
          setTimeout(resolve, 350);
        }
      };
      step();
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function issueSummary(issues) {
  return {
    consoleErrors: issues.consoleErrors,
    pageErrors: issues.pageErrors,
    failedRequests: issues.failedRequests,
    badResponses: issues.badResponses,
  };
}

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function saveJson(dir, name, data) {
  await writeFile(join(dir, name), JSON.stringify(data, null, 2), 'utf8');
}
