/**
 * Behavioural tests for the interaction layer, run in jsdom against the
 * built HTML. There is no rendering engine in this environment, so these
 * tests assert state and ARIA contracts rather than pixels.
 *
 *   npm run build && node scripts/behaviour.mjs
 */
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const results = [];
const mounted = [];
const test = (name, fn) => results.push({ name, fn });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function mount(htmlPath, url) {
  const html = await readFile(htmlPath, 'utf8');
  const virtualConsole = new (await import('jsdom')).VirtualConsole();
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });

  const { window } = dom;

  // Minimal browser APIs the module expects.
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(0), 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);

  global.window = window;
  global.document = window.document;
  // Node exposes a getter-only global `navigator`; redefine it for jsdom.
  Object.defineProperty(globalThis, 'navigator', {
    value: window.navigator,
    configurable: true,
    writable: true,
  });
  global.HTMLElement = window.HTMLElement;
  global.Element = window.Element;
  global.Node = window.Node;
  global.getComputedStyle = window.getComputedStyle.bind(window);
  // Use jsdom's implementation: Node's FormData cannot wrap a jsdom form.
  global.FormData = window.FormData;
  global.requestAnimationFrame = window.requestAnimationFrame;

  // A fresh module instance per mount: main.js boots against whichever
  // document is global at import time, so the cache must be bypassed.
  await import(`../src/main.js?mount=${Date.now()}${Math.random().toString(16).slice(2)}`);
  await new Promise((resolve) => setTimeout(resolve, 40));
  mounted.push(dom);

  return { dom, window, document: window.document };
}

/* ------------------------------------------------------------------ tests */

test('reveal fallback: without IntersectionObserver everything is visible', async () => {
  const { document } = await mount('dist/index.html', 'https://qintara.example/');
  const items = [...document.querySelectorAll('[data-reveal]')];
  assert(items.length > 0, 'expected reveal targets on the home page');
  const hidden = items.filter((item) => !item.classList.contains('is-inview'));
  assert(hidden.length === 0, `${hidden.length} reveal targets stayed hidden`);
});

test('menu: opens, traps focus, closes on Escape and restores focus', async () => {
  const { document, window } = await mount('dist/index.html', 'https://qintara.example/');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  assert(menu.inert === true, 'closed menu should be inert');
  toggle.click();

  assert(menu.dataset.open === 'true', 'menu did not open');
  assert(toggle.getAttribute('aria-expanded') === 'true', 'aria-expanded not set');
  assert(menu.getAttribute('aria-hidden') === 'false', 'aria-hidden not cleared');
  assert(menu.inert === false, 'menu should not be inert when open');
  assert(menu.contains(document.activeElement), 'focus did not move into the menu');

  const escape = new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
  document.dispatchEvent(escape);

  assert(menu.dataset.open === 'false', 'Escape did not close the menu');
  assert(menu.getAttribute('aria-hidden') === 'true', 'aria-hidden not restored');
  assert(document.activeElement === toggle, 'focus was not returned to the toggle');
});

test('navigation: current page is marked', async () => {
  const { document } = await mount('dist/work/aperture/index.html', 'https://qintara.example/work/aperture/');
  const current = [...document.querySelectorAll('[data-nav][aria-current="page"]')];
  assert(current.length === 1, `expected one aria-current link, found ${current.length}`);
  assert(current[0].dataset.nav === 'work', 'wrong section marked as current');
});

test('form: validation blocks empty submissions and reports errors', async () => {
  const { document, window } = await mount('dist/contact/index.html', 'https://qintara.example/contact/');
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert(status.dataset.state === 'error', 'status did not report an error');
  const invalid = [...document.querySelectorAll('[data-invalid="true"]')];
  assert(invalid.length === 3, `expected 3 invalid fields, found ${invalid.length}`);
  const nameError = document.querySelector('#name-error').textContent;
  assert(nameError.length > 0, 'name error message missing');
  assert(document.querySelector('#name').getAttribute('aria-invalid') === 'true', 'aria-invalid not set');
});

test('form: valid input clears errors and prepares a mail draft', async () => {
  const { document, window } = await mount('dist/contact/index.html', 'https://qintara.example/contact/');
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  document.querySelector('#name').value = 'Ada Lovelace';
  document.querySelector('#email').value = 'ada@example.com';
  document.querySelector('#message').value = 'We have an archive that nobody can navigate and we would like help with it.';

  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setTimeout(resolve, 20));

  const invalid = [...document.querySelectorAll('[data-invalid="true"]')];
  assert(invalid.length === 0, `${invalid.length} fields still invalid after valid input`);
  assert(status.dataset.state === 'ok', 'status did not confirm the mail draft');
  assert(/email app/i.test(status.textContent), 'status copy should explain what happens next');
});

test('copy button: reports a result instead of failing silently', async () => {
  const { document, window } = await mount('dist/contact/index.html', 'https://qintara.example/contact/');
  const button = document.querySelector('[data-copy]');
  const status = document.querySelector('#copy-status');

  window.document.execCommand = () => true;
  button.click();
  await new Promise((resolve) => setTimeout(resolve, 30));

  assert(status.textContent.length > 0, 'no status message after copying');
  assert(status.dataset.state === 'ok', 'copy status should be ok when execCommand succeeds');
});

test('instrument: degrades to an explained fallback without canvas', async () => {
  const { document } = await mount('dist/index.html', 'https://qintara.example/');
  const canvas = document.querySelector('[data-instrument] canvas');
  const fallback = document.querySelector('[data-instrument-fallback]');

  // jsdom has no canvas implementation, so getContext() returns null.
  assert(canvas.hidden === true, 'canvas should be hidden when 2D context is unavailable');
  assert(fallback.hidden === false, 'fallback text should be shown');
  assert(fallback.textContent.trim().length > 20, 'fallback should explain what is missing');
});

test('marquee: duplicated track is hidden from assistive technology', async () => {
  const { document } = await mount('dist/index.html', 'https://qintara.example/');
  const marquee = document.querySelector('.marquee');
  assert(marquee.getAttribute('aria-hidden') === 'true', 'decorative marquee should be aria-hidden');
});

/* ------------------------------------------------------------------- run */

let failed = 0;
for (const { name, fn } of results) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  ✗ ${name}`);
    console.log(`      ${error.message}`);
  }
}

console.log(`\n${results.length - failed}/${results.length} behavioural checks passed`);

// jsdom windows hold timers (the footer clock); close them so Node can exit.
for (const dom of mounted) dom.window.close();
process.exit(failed ? 1 : 0);
