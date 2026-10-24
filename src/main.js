/* ==========================================================================
   QINTARA — interaction layer
   Progressive enhancement only: every page is readable and navigable
   without JavaScript. No dependencies.
   ========================================================================== */

import { createInstrument } from './js/instrument.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/* -------------------------------------------------------------------------
   1. Disclosure menu (full-screen editorial overlay)
   ---------------------------------------------------------------------- */

function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  if (!toggle || !menu) return;

  const closeButton = menu.querySelector('[data-menu-close]');
  const focusableSelector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const isOpen = () => menu.dataset.open === 'true';

  function setOpen(open) {
    menu.dataset.open = String(open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';

    if (open) {
      // Fall back to the toggle when the browser did not focus the trigger
      // (for example when it was activated by script rather than a click).
      lastFocused =
        document.activeElement instanceof HTMLElement && document.activeElement !== document.body
          ? document.activeElement
          : toggle;
      const first = menu.querySelector(focusableSelector);
      first?.focus({ preventScroll: true });
    } else if (lastFocused instanceof HTMLElement) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  closeButton?.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const items = [...menu.querySelectorAll(focusableSelector)].filter(
      (el) => el.offsetParent !== null,
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // A same-page anchor inside the menu should close it before scrolling.
  menu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  setOpen(false);
}

/* -------------------------------------------------------------------------
   2. Scroll reveals — one observer, no layout thrash
   ---------------------------------------------------------------------- */

function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-inview'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  items.forEach((item) => observer.observe(item));
}

/* -------------------------------------------------------------------------
   2b. Current page indicator
   aria-current is a progressive enhancement: the links work regardless, but
   assistive technology gets the state once the module has run.
   ---------------------------------------------------------------------- */

function initCurrentPage() {
  const path = window.location.pathname.replace(/index\.html$/, '');
  const navArea = path.startsWith('/work') ? 'work' : path.startsWith('/studio') ? 'studio' : path.startsWith('/contact') ? 'contact' : '';

  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === navArea) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/* -------------------------------------------------------------------------
   3. Header state (quiet border after the first scroll)
   ---------------------------------------------------------------------- */

function initHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );

  update();
}

/* -------------------------------------------------------------------------
   4. Work rows — pointer-following plate preview
   ---------------------------------------------------------------------- */

function initWorkPreview() {
  const preview = document.querySelector('[data-work-preview]');
  const rows = document.querySelectorAll('[data-preview-src]');
  if (!preview || !rows.length || !finePointer.matches) return;

  const image = preview.querySelector('img');
  if (!image) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  let active = false;

  const width = () => preview.offsetWidth || 280;
  const height = () => preview.offsetHeight || 187;

  function render() {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    preview.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) scale(${
      active ? 1 : 0.96
    })`;

    if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
      frame = requestAnimationFrame(render);
    } else {
      frame = 0;
    }
  }

  function kick() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function place(event) {
    const pad = 18;
    const offsetX = event.clientX > window.innerWidth - width() - pad * 3 ? -width() - pad : pad;
    targetX = event.clientX + offsetX;
    targetY = Math.min(
      Math.max(event.clientY - height() / 2, pad),
      window.innerHeight - height() - pad,
    );
  }

  rows.forEach((row) => {
    const src = row.dataset.previewSrc;
    const alt = row.dataset.previewAlt || '';

    row.addEventListener('pointerenter', (event) => {
      if (!src) return;
      if (image.getAttribute('src') !== src) {
        image.setAttribute('src', src);
        image.setAttribute('alt', alt);
      }
      active = true;
      currentX = event.clientX;
      currentY = event.clientY - height() / 2;
      place(event);
      preview.dataset.visible = 'true';
      kick();
    });

    row.addEventListener('pointermove', (event) => {
      if (!active) return;
      place(event);
      kick();
    });

    row.addEventListener('pointerleave', () => {
      active = false;
      preview.dataset.visible = 'false';
      kick();
    });
  });
}

/* -------------------------------------------------------------------------
   5. Copy-to-clipboard with an honest fallback
   ---------------------------------------------------------------------- */

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:-1000px;opacity:0';
  document.body.appendChild(area);
  area.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const original = button.dataset.copyLabel || button.textContent.trim();
    const status = document.querySelector(button.dataset.copyStatus || '');

    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      if (!value) return;

      const ok = await copyText(value);
      const message = ok ? 'Email address copied' : 'Copy failed — select the address manually';

      if (status) {
        status.textContent = message;
        status.dataset.state = ok ? 'ok' : 'error';
      }

      button.textContent = ok ? 'Copied' : original;
      window.setTimeout(() => {
        button.textContent = original;
      }, 2200);
    });
  });
}

/* -------------------------------------------------------------------------
   6. Contact form — validates, then composes a mail draft.
   Deliberately no network call: a static site cannot send mail, and a form
   that silently does nothing would be a lie.
   ---------------------------------------------------------------------- */

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const endpoint = form.dataset.mailto;

  const setFieldError = (field, message) => {
    const wrapper = field.closest('.field');
    const error = wrapper?.querySelector('.field__error');
    wrapper?.setAttribute('data-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const rules = {
    name: (value) => (value.trim().length >= 2 ? '' : 'Please tell us what to call you.'),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ''
        : 'Please enter an email address we can reply to.',
    message: (value) =>
      value.trim().length >= 20
        ? ''
        : 'A sentence or two about the project helps — at least 20 characters.',
  };

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const rule = rules[field.name];
      if (rule && field.value.trim()) setFieldError(field, rule(field.value));
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;

    Object.entries(rules).forEach(([name, rule]) => {
      const field = form.elements.namedItem(name);
      if (!(field instanceof HTMLElement)) return;

      const message = rule(field.value);
      setFieldError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      if (status) {
        status.textContent = 'Please fix the highlighted fields.';
        status.dataset.state = 'error';
      }
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const scope = String(data.get('scope') || '').trim();
    const message = String(data.get('message') || '').trim();

    const subject = scope ? `Project enquiry — ${scope}` : 'Project enquiry';
    const body = [
      message,
      '',
      '—',
      `${name}`,
      email,
    ].join('\n');

    if (status) {
      status.textContent =
        'Your email app should open with the message ready to send. Nothing is stored on this site.';
      status.dataset.state = 'ok';
    }

    // Hand off to the mail client. Some browsers and embedded views block
    // mailto: — the status message above still explains what should happen.
    try {
      window.location.href = `mailto:${endpoint}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
    } catch {
      if (status) {
        status.textContent = `Your browser blocked the mail handler. Write to ${endpoint} directly.`;
        status.dataset.state = 'error';
      }
    }
  });
}

/* -------------------------------------------------------------------------
   7. Local clock in the footer — the studio's time, clearly labelled.
   ---------------------------------------------------------------------- */

function initClocks() {
  const clocks = document.querySelectorAll('[data-clock]');
  if (!clocks.length) return;

  const zone = clocks[0].dataset.clock || 'Asia/Kolkata';
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: zone,
  });

  const tick = () => {
    const time = formatter.format(new Date());
    clocks.forEach((node) => {
      node.textContent = time;
    });
  };

  tick();
  window.setInterval(tick, 20_000);
}

/* -------------------------------------------------------------------------
   8. Boot
   ---------------------------------------------------------------------- */

function boot() {
  initMenu();
  initCurrentPage();
  initReveals();
  initHeaderState();
  initWorkPreview();
  initCopyButtons();
  initContactForm();
  initClocks();

  document.querySelectorAll('[data-instrument]').forEach((stage) => {
    createInstrument(stage, { reduceMotion });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
