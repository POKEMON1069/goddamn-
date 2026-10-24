import { defineConfig } from 'vite';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const page = (...parts) => resolve(root, ...parts);

// Single source of truth for the details that appear across every page.
const site = JSON.parse(readFileSync(resolve(root, 'content/site.json'), 'utf8'));

/**
 * Replaces {{token}} placeholders in HTML with values from content/site.json,
 * so an email address, domain or repository URL is edited in exactly one file.
 */
function injectContent(html) {
  return html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
    if (!(key in site)) {
      throw new Error(`[content] unknown token {{${key}}} — add it to content/site.json`);
    }
    return String(site[key]);
  });
}

/**
 * Tiny HTML partial include, so navigation, footer and colophon live in one
 * place across the eight static pages without adding a templating dependency.
 *
 * Usage:  <!-- @include partials/site-header.html -->
 */
const INCLUDE = /^([ \t]*)<!--\s*@include\s+([^\s>]+)\s*-->[ \t]*$/gm;

function expandIncludes(html, baseDir, depth = 0) {
  if (depth > 5) throw new Error('[html-includes] includes nested more than 5 deep');

  return html.replace(INCLUDE, (_match, indent, file) => {
    const filePath = resolve(baseDir, file);
    if (!existsSync(filePath)) {
      throw new Error(`[html-includes] partial not found: ${file}`);
    }
    const partial = expandIncludes(readFileSync(filePath, 'utf8'), dirname(filePath), depth + 1);
    return partial
      .replace(/\n$/, '')
      .split('\n')
      .map((line) => (line.length ? indent + line : line))
      .join('\n');
  });
}

function htmlCompose() {
  return {
    name: 'qintara-html-compose',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return injectContent(expandIncludes(html, root));
      },
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [htmlCompose()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        index: page('index.html'),
        work: page('work/index.html'),
        'work-aperture': page('work/aperture/index.html'),
        'work-longhand': page('work/longhand/index.html'),
        'work-signal': page('work/signal/index.html'),
        'work-edge': page('work/edge/index.html'),
        studio: page('studio/index.html'),
        contact: page('contact/index.html'),
        notfound: page('404.html'),
      },
    },
  },
});
