import { getMetadata } from './aem.js';

/* Shared helpers for the header and footer blocks (site chrome). */

/** Page theme `golden-ticket` (metadata `Theme | golden-ticket`) selects the promo chrome. */
export function isPromoTheme() {
  return document.body.classList.contains('golden-ticket');
}

const PROMO_ROOT = '/us/en/xp/golden-ticket';

/**
 * Path of the authored chrome document: page metadata `nav` / `footer` wins, else the
 * theme's default (`/nav` + `/footer`, or the promo pair under the golden-ticket tree).
 * @param {'nav'|'footer'} kind
 * @returns {string}
 */
export function chromePath(kind) {
  const meta = getMetadata(kind);
  if (meta) return new URL(meta, window.location).pathname;
  return isPromoTheme() ? `${PROMO_ROOT}/${kind}` : `/${kind}`;
}

/**
 * The authored sections of a loaded fragment, as their content wrappers.
 * @param {Element} fragment
 * @returns {Element[]}
 */
export function fragmentSections(fragment) {
  if (!fragment) return [];
  return [...fragment.querySelectorAll(':scope > .section')].map(
    (section) => section.querySelector('.default-content-wrapper') || section,
  );
}

/**
 * Links that leave this site's page tree open in a new tab, as on the source
 * (other origins, and the golden-ticket promo platform when linked from the site chrome).
 * @param {HTMLAnchorElement} a
 */
export function decorateTarget(a) {
  let url;
  try {
    url = new URL(a.href, window.location);
  } catch {
    return;
  }
  if (url.hash && url.pathname === window.location.pathname) return;
  const external = url.origin !== window.location.origin;
  const promo = !isPromoTheme() && url.pathname.startsWith(`${PROMO_ROOT}/`);
  if (external || promo) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
}

/**
 * Wraps the authored link text in the gold hover treatment (`span.gold-link`).
 * Moves the existing nodes; never rebuilds the text.
 * @param {HTMLAnchorElement} a
 * @returns {HTMLAnchorElement}
 */
export function goldLink(a) {
  const span = document.createElement('span');
  span.className = 'gold-link';
  span.dataset.content = a.textContent.trim();
  span.append(...a.childNodes);
  a.append(span);
  return a;
}

/**
 * The brand link of a section: the first link, with the section's first image moved into it.
 * The authored link text becomes its accessible name.
 * @param {Element} section
 * @returns {HTMLAnchorElement|null}
 */
export function brandLink(section) {
  if (!section) return null;
  const a = section.querySelector('a');
  if (!a) return null;
  const img = section.querySelector('img');
  const label = a.textContent.trim();
  if (img) {
    // the logo is vector art: keep the SVG rendition, never the rasterised webp ones
    const picture = img.closest('picture');
    if (picture) picture.querySelectorAll('source[type="image/webp"]').forEach((s) => s.remove());
    img.loading = 'eager';
    if (label) a.setAttribute('aria-label', label);
    if (!img.alt && label) img.alt = label;
    [...a.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) n.remove();
    });
    if (!a.contains(img)) a.append(img);
  }
  return a;
}

/**
 * Turns an authored social link (`:icon-name:` + network name) into an icon button.
 * @param {HTMLAnchorElement} a
 * @param {string} [classes] button classes
 * @returns {HTMLAnchorElement}
 */
export function socialButton(a, classes = 'btn btn-md btn-blurred') {
  const label = a.textContent.trim();
  if (label) a.setAttribute('aria-label', label);
  [...a.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) n.remove();
  });
  const icon = a.querySelector('.icon');
  if (icon) {
    icon.setAttribute('aria-hidden', 'true');
    if (classes.includes('btn')) icon.classList.add('btn-icon');
  }
  if (classes) a.className = classes;
  decorateTarget(a);
  return a;
}

/**
 * Creates an element with a class name.
 * @param {string} tag
 * @param {string} [className]
 * @param {Object} [attrs]
 * @returns {HTMLElement}
 */
export function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * Parses a trusted, static SVG string owned by this code (decorative chrome shapes).
 * @param {string} markup
 * @returns {SVGElement}
 */
export function svg(markup) {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml');
  return document.importNode(doc.documentElement, true);
}
