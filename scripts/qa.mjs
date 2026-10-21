/**
 * Visual + behavioural QA for a production build.
 *
 *   npm run build && npm start -- -p 4400   (in another shell)
 *   CHROME_PATH=/path/to/chromium node scripts/qa.mjs
 *
 * Writes screenshots and a report.json per page into .shots/<page>/.
 * Needs puppeteer-core + axe-core (devDependencies) and a Chromium binary.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");

const BASE = process.env.BASE ?? "http://127.0.0.1:4400";
const OUT = path.resolve(process.env.OUT ?? ".shots");
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/chromium";
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;

const PAGES = [
  { key: "home", url: "/" },
  { key: "work", url: "/work" },
  { key: "case-verdant", url: "/work/verdant-seed-library" },
  { key: "case-kiln", url: "/work/kiln" },
  { key: "about", url: "/about" },
  { key: "contact", url: "/contact" },
  { key: "404", url: "/no-such-sheet" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VITALS = () => {
  window.__v = { lcp: 0, cls: 0, longtasks: [], lcpEl: "" };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      window.__v.lcp = Math.round(entry.startTime);
      window.__v.lcpEl = entry.element ? entry.element.tagName + "." + entry.element.className : entry.url ?? "";
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        window.__v.cls += entry.value;
        window.__v.clsSources = window.__v.clsSources || [];
        (entry.sources || []).forEach((src) => {
          const node = src.node;
          if (!node) return;
          window.__v.clsSources.push(
            (node.nodeName || "") + "." + (node.className || "").toString().slice(0, 40) + " " + Math.round(entry.value * 1000) / 1000,
          );
        });
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__v.longtasks.push(Math.round(entry.duration));
  }).observe({ type: "longtask", buffered: true });
};

const FPS = () => {
  window.__fps = new Promise((resolve) => {
    const frames = [];
    let last = performance.now();
    const start = last;
    const tick = (now) => {
      frames.push(now - last);
      last = now;
      if (now - start < 2600) requestAnimationFrame(tick);
      else {
        const deltas = frames.slice(2);
        const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const worst = Math.max(...deltas);
        resolve({ avg: Math.round(avg * 10) / 10, fps: Math.round(1000 / avg), worst: Math.round(worst) });
      }
    };
    requestAnimationFrame(tick);
  });
};

async function idleMotion(page) {
  const shots = [];
  for (let i = 0; i < 3; i++) {
    shots.push(await page.screenshot({ type: "png" }));
    if (i < 2) await sleep(1300);
  }
  const raws = await Promise.all(shots.map((buf) => sharp(buf).raw().toBuffer({ resolveWithObject: true })));
  let best = 0;
  for (let k = 1; k < raws.length; k++) {
    let changed = 0;
    const n = Math.min(raws[0].data.length, raws[k].data.length);
    for (let i = 0; i < n; i += 4) {
      if (Math.abs(raws[0].data[i] - raws[k].data[i]) > 6) changed++;
    }
    best = Math.max(best, changed);
  }
  return { changedPixels: best, totalPixels: Math.floor(raws[0].data.length / 4), moving: best > 80 };
}

async function focusWalk(page, steps = 16) {
  const stops = [];
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 42),
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
        visibleOutline:
          (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
          cs.boxShadow !== "none" ||
          cs.textDecorationLine !== "none",
        inViewport: rect.top >= -2 && rect.bottom <= window.innerHeight + 2 && rect.width > 0,
        opacity: cs.opacity,
        visuallyHidden: parseFloat(cs.opacity) < 0.5 || rect.width <= 1 || rect.height <= 1,
      };
    });
    if (!info) break;
    stops.push(info);
  }
  return stops;
}

const HOVER_SELECTORS = [
  ".nav__link",
  ".nav__cta",
  ".row",
  ".pcard__media",
  ".pcard__link",
  ".link-arrow",
  ".link-inline",
  ".foot__link",
  ".chip",
  ".faq__q",
  ".btn--lg",
  ".case__next-link",
];

const styleOf = (el) => {
  const cs = getComputedStyle(el);
  const before = getComputedStyle(el, "::before");
  const after = getComputedStyle(el, "::after");
  const inner = el.querySelector(".row__title-inner, .btn__label, .btn__rule, .nav__link-idx, img");
  const innerCs = inner ? getComputedStyle(inner) : null;
  return {
    fill: before.transform + before.backgroundColor,
    rule: after.transform + after.backgroundColor,
    inner: innerCs ? innerCs.transform + innerCs.width + innerCs.color : "none",
    color: cs.color,
    background: cs.backgroundColor,
    transform: cs.transform,
    boxShadow: cs.boxShadow,
    borderBottomColor: cs.borderBottomColor,
    backgroundSize: cs.backgroundSize,
    paddingLeft: cs.paddingLeft,
    textDecoration: cs.textDecorationLine,
    opacity: cs.opacity,
  };
};

async function hoverPairs(page, dir) {
  const results = [];
  for (const selector of HOVER_SELECTORS) {
    const handle = await page.$(selector);
    if (!handle) continue;
    const el = handle;
    await page.mouse.move(1, 1);
    await sleep(220);
    const rest = await el.evaluate(styleOf);
    const restShot = await el.screenshot({ path: path.join(dir, `h-${results.length}-rest.png`) }).catch(() => null);
    await el.hover().catch(() => {});
    await sleep(650);
    const hover = await el.evaluate(styleOf);
    await el.screenshot({ path: path.join(dir, `h-${results.length}-hover.png`) }).catch(() => null);
    const changed = Object.keys(rest).filter((k) => rest[k] !== hover[k]);
    const onlyColor = changed.length > 0 && changed.every((k) => ["color", "background", "borderBottomColor", "textDecoration"].includes(k));
    results.push({
      selector,
      changed,
      onlyColor,
      noChange: changed.length === 0,
      restShot: Boolean(restShot),
      before: rest,
      after: hover,
    });
    await page.mouse.move(2, 2);
    await sleep(120);
  }
  return results;
}

async function auditPage(page) {
  await page.addScriptTag({ path: AXE });
  const results = await page.evaluate(async () => {
    // @ts-ignore
    const r = await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      resultTypes: ["violations"],
    });
    return r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 4).map((n) => ({ target: n.target, summary: n.failureSummary?.slice(0, 240) })),
    }));
  });
  return results;
}

async function scrollShots(page, dir, prefix) {
  const positions = await page.evaluate(() => {
    const h = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const stops = [0];
    document.querySelectorAll("section, .page-head, .case__cover, .worklist > *, .contact__head").forEach((s) => {
      const top = window.scrollY + s.getBoundingClientRect().top - 70;
      if (top > 40) stops.push(Math.min(top, h - vh));
    });
    stops.push(h - vh);
    return [...new Set(stops.map((s) => Math.round(s)))].slice(0, 9);
  });
  let i = 0;
  for (const y of positions) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await sleep(700);
    await page.screenshot({ path: path.join(dir, `${prefix}-${String(i).padStart(2, "0")}.png`) });
    i++;
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(400);
  return positions.length;
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--force-device-scale-factor=1",
      "--font-render-hinting=none",
      "--disable-gpu",
    ],
  });

  const summary = [];

  for (const target of PAGES) {
    if (ONLY && !ONLY.includes(target.key)) continue;
    const dir = path.join(OUT, target.key);
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });
    const report = { page: target.key, url: target.url, console: [], failedRequests: [], desktop: {}, mobile: {}, reducedMotion: {}, a11y: [], keyboard: [], hover: [] };

    // ---------- Desktop ----------
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (["error", "warning"].includes(msg.type())) report.console.push(`${msg.type()}: ${msg.text().slice(0, 220)}`);
    });
    page.on("pageerror", (err) => report.console.push(`pageerror: ${(err && err.stack ? err.stack : String(err)).slice(0, 600)}`));
    page.on("requestfailed", (req) =>
      report.failedRequests.push(`${req.url().replace(BASE, "")} ${req.failure()?.errorText ?? ""}`),
    );
    page.on("response", (res) => {
      const isDocument = res.request().resourceType() === "document";
      if (res.status() >= 400 && !(isDocument && res.status() === 404)) {
        report.failedRequests.push(`${res.status()} ${res.url().replace(BASE, "")}`);
      }
    });

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(VITALS);
    await page.goto(`${BASE}${target.url}`, { waitUntil: "networkidle2", timeout: 45000 });

    const loaderStart = Date.now();
    await page.waitForFunction(() => document.documentElement.dataset.ready === "true" || !document.querySelector(".loader"), { timeout: 6000 }).catch(() => {});
    report.desktop.loaderMs = Date.now() - loaderStart;
    await sleep(900);

    await page.screenshot({ path: path.join(dir, "d-00-hero.png") });
    report.desktop.sections = await scrollShots(page, dir, "d");

    report.desktop.vitals = await page.evaluate(() => window.__v);
    report.desktop.overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      offenders: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed";
        })
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(el.getBoundingClientRect().right)}`),
    }));
    report.desktop.tapTargets = await page.evaluate(() => {
      const small = [];
      document.querySelectorAll("a, button, input, select, textarea, summary, label.chip").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0) return;
        if (cs.opacity === "0" || cs.visibility === "hidden" || el.getAttribute("aria-hidden") === "true") return;
        if (r.width < 24 || r.height < 24) small.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      return small.slice(0, 10);
    });
    report.desktop.idle = await idleMotion(page);
    report.a11y = await auditPage(page);
    report.keyboard = await focusWalk(page);
    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    await page.mouse.move(1, 1);
    await sleep(300);
    report.hover = await hoverPairs(page, dir);

    // ---------- Scroll FPS (desktop) ----------
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(300);
    const fpsPromise = page.evaluate(async () => (window.__fps = new Promise((resolve) => {
      const frames = [];
      let last = performance.now();
      const start = last;
      const tick = (now) => {
        frames.push(now - last);
        last = now;
        if (now - start < 2200) requestAnimationFrame(tick);
        else {
          const deltas = frames.slice(2);
          const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
          resolve({ avg: Math.round(avg * 10) / 10, fps: Math.round(1000 / avg), worst: Math.round(Math.max(...deltas)) });
        }
      };
      requestAnimationFrame(tick);
    })));
    for (let i = 0; i < 22; i++) {
      await page.mouse.wheel({ deltaY: 260 });
      await sleep(70);
    }
    report.desktop.scrollFps = await fpsPromise;

    // ---------- Page transition check (home only) ----------
    if (target.key === "home") {
      const link = await page.$(".row");
      if (link) {
        await link.hover();
        await page.mouse.down();
        await page.mouse.up();
        await sleep(330);
        await page.screenshot({ path: path.join(dir, "t-mid-curtain.png") });
        await sleep(1500);
        report.desktop.afterTransitionUrl = page.url();
        await page.screenshot({ path: path.join(dir, "t-after.png") });
      }
      await page.goto(`${BASE}${target.url}`, { waitUntil: "networkidle2" });
      await sleep(1600);
    }

    await ctx.close();

    // ---------- Mobile, throttled ----------
    const mctx = await browser.createBrowserContext();
    const mob = await mctx.newPage();
    const cdp = await mob.createCDPSession();
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: "cellular4g",
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await mob.evaluateOnNewDocument(VITALS);
    await mob.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 });
    });
    await mob.goto(`${BASE}${target.url}`, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(2200);
    await mob.screenshot({ path: path.join(dir, "m-00-hero.png") });
    report.mobile.vitals = await mob.evaluate(() => window.__v);
    report.mobile.overflow = await mob.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      offenders: [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed";
        })
        .slice(0, 8)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} right=${Math.round(el.getBoundingClientRect().right)}`),
    }));
    report.mobile.tapTargets = await mob.evaluate(() => {
      const small = [];
      document.querySelectorAll("a, button, input, select, textarea, summary, label.chip").forEach((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0) return;
        if (cs.opacity === "0" || cs.visibility === "hidden" || el.getAttribute("aria-hidden") === "true") return;
        if (r.width < 24 || r.height < 24) small.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      return small.slice(0, 10);
    });
    await scrollShots(mob, dir, "m");
    // menu
    const burger = await mob.$(".nav__burger");
    if (burger) {
      await burger.click();
      await sleep(800);
      await mob.screenshot({ path: path.join(dir, "m-menu.png") });
      await mob.keyboard.press("Escape");
      await sleep(400);
    }
    report.mobile.horizontalScrollOnMenu = await mob.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await mctx.close();

    // ---------- Reduced motion ----------
    const rctx = await browser.createBrowserContext();
    const red = await rctx.newPage();
    await red.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await red.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await red.goto(`${BASE}${target.url}`, { waitUntil: "networkidle2", timeout: 45000 });
    await sleep(1200);
    report.reducedMotion.hidden = await red.evaluate(() => {
      const out = [];
      document.querySelectorAll("h1, h2, h3, p, li, dd, a, img, .media, .line").forEach((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const insideViewport = r.bottom > -1 && r.top < window.innerHeight + 3000;
        if (!insideViewport) return;
        if (parseFloat(cs.opacity) < 0.9) out.push(`opacity ${cs.opacity} ${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
        if (cs.clipPath !== "none") out.push(`clip ${cs.clipPath} ${el.tagName.toLowerCase()}`);
        if (cs.visibility === "hidden") out.push(`hidden ${el.tagName.toLowerCase()}`);
        if (cs.transform !== "none" && /matrix\(1, 0, 0, 1, 0, (?!0)/.test(cs.transform)) out.push(`transform ${cs.transform} ${el.tagName.toLowerCase()}`);
      });
      return [...new Set(out)].slice(0, 12);
    });
    report.reducedMotion.loaderPresent = await red.evaluate(() => Boolean(document.querySelector(".loader")));
    report.reducedMotion.smoothScroll = await red.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    await red.screenshot({ path: path.join(dir, "r-00-hero.png") });
    await scrollShots(red, dir, "r");
    await rctx.close();

    await fs.writeFile(path.join(dir, "report.json"), JSON.stringify(report, null, 2));
    summary.push({
      page: target.key,
      loaderMs: report.desktop.loaderMs,
      console: report.console.length,
      failed: report.failedRequests.length,
      a11y: report.a11y.map((v) => `${v.id}:${v.impact}`),
      overflow: report.desktop.overflow.scrollWidth > report.desktop.overflow.innerWidth + 1,
      mOverflow: report.mobile.overflow.scrollWidth > report.mobile.overflow.innerWidth + 1,
      smallTargets: report.desktop.tapTargets.length + report.mobile.tapTargets.length,
      mobileLcp: report.mobile.vitals.lcp,
      cls: Math.round(report.mobile.vitals.cls * 1000) / 1000,
      idle: report.desktop.idle.moving,
      noHoverChange: report.hover.filter((h) => h.noChange).map((h) => h.selector),
      colorOnly: report.hover.filter((h) => h.onlyColor).map((h) => h.selector),
      focusNoStyle: report.keyboard.filter((k) => !k.visibleOutline && !k.visuallyHidden).map((k) => k.text),
      reducedHidden: report.reducedMotion.hidden.length,
      fps: report.desktop.scrollFps,
    });
    console.log("done", target.key);
  }

  await fs.writeFile(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
