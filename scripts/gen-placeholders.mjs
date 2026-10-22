/*
 * Generates honest, typographic placeholder images for the contact-sheet
 * frames. These replace nothing real — they are marked placeholders for the
 * owner to substitute with their own work photography (see DESIGN.md).
 *
 * No external assets or generative-people imagery: pure code + type.
 */
import fs from "node:fs";
import path from "node:path";

const GROUND = "#0B0C0D";
const LINE = "#1A1E24";
const INK = "#F4F6F8";
const MUTED = "#8A939D";
const ACCENT = "#FF2D55";

const W = 1200;
const H = 800;

const projects = [
  { slug: "halcyon", num: "01", title: "Halcyon", kicker: "Brand + website" },
  { slug: "tension", num: "02", title: "Tension", kicker: "Editorial design" },
  { slug: "lead-line", num: "03", title: "Lead Line", kicker: "Product design" },
  { slug: "sink", num: "04", title: "Sink", kicker: "Type specimen" },
  { slug: "meridian", num: "05", title: "Meridian", kicker: "Campaign site" },
  { slug: "quiet", num: "06", title: "Quiet", kicker: "Print + digital" },
];

function svg({ num, title, kicker }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <style>
        .t { fill: ${INK}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .k { fill: ${ACCENT}; font-weight: 800; letter-spacing: 0.2em; }
        .m { fill: ${MUTED}; font-size: 24px; }
      </style>
    </defs>
    <rect width="${W}" height="${H}" fill="${GROUND}" />
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${LINE}" stroke-width="2" />
    <rect x="24" y="24" width="60" height="60" fill="${ACCENT}" />
    <text x="54" y="52" class="t k" font-size="22" text-anchor="middle" dy="0.35em">${num}</text>
    <text x="150" y="340" class="t" font-size="56" font-weight="800" letter-spacing="-0.04em">${title}</text>
    <text x="150" y="410" class="t k" font-size="20" letter-spacing="0.2em">${kicker.toUpperCase()}</text>
    <text x="150" y="700" class="m" font-size="20" style="font-style:italic">Placeholder image — replace with real project photography.</text>
    <text x="${W - 150}" y="700" class="m" font-size="20" text-anchor="end" style="font-style:italic">GODDAMN- · contact sheet</text>
  </svg>`;
}

const dir = path.join(process.cwd(), "public", "images", "work");
fs.mkdirSync(dir, { recursive: true });

for (const p of projects) {
  fs.writeFileSync(path.join(dir, `${p.slug}.svg`), svg(p));
}

// OG image — typographic, matches the contact-sheet idea.
fs.mkdirSync(path.join(process.cwd(), "public", "images"), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), "public", "images", "og-image.svg"),
  svg({ num: "—", title: "GODDAMN-", kicker: "Contact-sheet portfolio · Independent designer & creative developer" })
);

console.log("generated", projects.length + 1, "placeholder images");