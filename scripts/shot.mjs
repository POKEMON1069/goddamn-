/**
 * Quick single-shot capture for iterating on a page.
 *   node scripts/shot.mjs / 1440 .screenshots/home.png
 */
import { launch, newPage, goto, watchPage } from './harness.mjs';

const [, , path = '/', width = '1440', out = '.screenshots/shot.png', height = '900', full = '1'] =
  process.argv;

const browser = await launch();
const page = await newPage(browser, {
  name: 'custom',
  width: Number(width),
  height: Number(height),
  deviceScaleFactor: 1,
  isMobile: Number(width) < 500,
  hasTouch: Number(width) < 500,
});
const issues = watchPage(page);
await goto(page, path);
await page.screenshot({ path: out, fullPage: full === '1' });

const info = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  scrollHeight: document.documentElement.scrollHeight,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  h1: document.querySelector('h1')?.textContent?.trim().slice(0, 80),
  fontUsed: getComputedStyle(document.querySelector('h1') || document.body).fontFamily,
}));

console.log(JSON.stringify({ ...info, issues }, null, 2));
await browser.close();
