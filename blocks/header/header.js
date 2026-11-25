import { loadFragment } from '../fragment/fragment.js';
import {
  isPromoTheme,
  chromePath,
  fragmentSections,
  decorateTarget,
  goldLink,
  brandLink,
  socialButton,
  el,
  svg,
} from '../../scripts/chrome.js';

/*
 * Site header. Two themes, chosen by page metadata `Theme`:
 * - default (sling): fixed purple band + logo tab, desktop link row (>= 768px) and the
 *   mobile slide-down panel. Reads /nav (1: brand image + link, 2: link list) and the
 *   /footer document for the panel's social, legal and copyright rows.
 * - `golden-ticket`: the promo bar with its centred logo tab. Reads
 *   /us/en/xp/golden-ticket/nav (1: brand image + link).
 * `nav` / `footer` page metadata override either path.
 */

const TAB_PATH = 'M170.299 35.5243C171.034 25.8724 170.299 12.7351 189.285 12.7351V0H0V12.7351H39.9527'
  + 'C55.8764 12.7351 55.4276 27.1459 55.4276 35.5243C55.1826 53.2193 72.9818 62 80.0259 62H147.946'
  + 'C164.482 60.3243 169.38 47.5891 170.299 35.5243Z';
const MOBILE_BG_PATH = 'M170.299 35.5243C171.034 25.8724 170.299 12.7351 189.285 12.7351H375V0H0V12.7351'
  + 'H39.9527C55.8764 12.7351 55.4276 27.1459 55.4276 35.5243C55.1826 53.2193 72.9818 62 80.0259 62'
  + 'H147.946C164.482 60.3243 169.38 47.5891 170.299 35.5243Z';
const SVG_NS = 'xmlns="http://www.w3.org/2000/svg"';
const FILLET_LEFT = 'M22.7617 0V16H16.7617V16.7617C16.7616 7.50452 9.2572 9.1522e-05 0 0H22.7617Z';
const FILLET_RIGHT = 'M0 0V16H6V16.7617C6.0001 7.50452 13.5045 9.1522e-05 22.7617 0H0Z';

const isDesktop = window.matchMedia('(width >= 768px)');

function addSkipLink() {
  const main = document.querySelector('main');
  if (!main || document.querySelector('a.skip-link')) return;
  if (!main.id) main.id = 'main-content';
  const skip = el('a', 'visually-hidden skip-link', { href: `#${main.id}` });
  skip.textContent = 'Skip to main content';
  document.body.prepend(skip);
}

function star(className) {
  const img = el('img', className, {
    src: `${window.hlx.codeBasePath}/icons/decorative-star.svg`,
    alt: '',
    width: '24',
    height: '24',
    'aria-hidden': 'true',
  });
  return img;
}

function buildMobilePanel(brand, links, footerSections) {
  const [, social, legal, copy] = footerSections;
  const panel = el('div', 'mnav', {
    id: 'mobile-menu',
    'data-open': 'false',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Mobile navigation',
  });
  const stage = el('div', 'mnav-stage');
  const surface = el('div', 'mnav-surface');
  const content = el('div', 'mnav-content', { inert: '' });

  const nav = el('nav', 'mnav-links', { 'aria-label': 'Mobile navigation' });
  links.forEach((a) => {
    const link = a.cloneNode(true);
    link.className = 'btn btn-text';
    const span = document.createElement('span');
    span.append(...link.childNodes);
    link.append(span);
    nav.append(link);
  });
  content.append(nav, star('mnav-star'));

  if (social) {
    const box = el('div', 'mnav-social');
    const title = social.querySelector('p');
    if (title) box.append(title.cloneNode(true));
    const row = el('div', 'mnav-social-row');
    social.querySelectorAll('a').forEach((a) => row.append(socialButton(a.cloneNode(true))));
    box.append(row);
    content.append(box, star('mnav-star'));
  }
  if (legal) {
    const box = el('div', 'mnav-legal', { 'aria-label': 'Footer links' });
    legal.querySelectorAll('a').forEach((a) => {
      const link = goldLink(a.cloneNode(true));
      link.className = 'legal-link';
      decorateTarget(link);
      box.append(link);
    });
    content.append(box);
  }
  if (copy) {
    const box = el('div', 'mnav-copy');
    box.textContent = copy.textContent.trim();
    content.append(box);
  }
  surface.append(content);

  const chrome = el('div', 'mnav-chrome');
  const bg = el('div', 'mnav-chrome-bg', { 'aria-hidden': 'true' });
  bg.append(svg(`<svg ${SVG_NS} height="62" fill="none" aria-hidden="true">`
    + `<path fill="#980186" d="${MOBILE_BG_PATH}"/></svg>`));
  chrome.append(bg);
  if (brand) {
    const logo = brand.cloneNode(true);
    logo.className = 'mnav-logo';
    chrome.append(logo);
  }
  const toggle = el('button', 'mnav-toggle', {
    type: 'button',
    'aria-expanded': 'false',
    'aria-controls': 'mobile-menu',
    'aria-label': 'Open menu',
  });
  const bars = el('span', 'mnav-bars', { 'aria-hidden': 'true' });
  bars.append(el('span'), el('span'), el('span'));
  toggle.append(bars);
  chrome.append(toggle);

  stage.append(surface, chrome);
  panel.append(stage);

  const set = (open) => {
    panel.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) content.removeAttribute('inert');
    else content.setAttribute('inert', '');
    document.documentElement.classList.toggle('has-overlay', open);
  };
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    set(panel.dataset.open !== 'true');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.dataset.open === 'true') {
      set(false);
      toggle.focus();
    }
  });
  isDesktop.addEventListener('change', (mq) => {
    if (mq.matches) set(false);
  });
  return panel;
}

async function decorateSite(block) {
  const [navFragment, footerFragment] = await Promise.all([
    loadFragment(chromePath('nav')),
    loadFragment(chromePath('footer')),
  ]);
  const [brandSection, linkSection] = fragmentSections(navFragment);
  const brand = brandLink(brandSection);
  if (brand) {
    brand.className = 'site-header-logo';
    decorateTarget(brand);
  }
  const links = linkSection ? [...linkSection.querySelectorAll('a')] : [];
  links.forEach((a) => decorateTarget(a));

  const siteNav = el('div', 'site-nav');
  siteNav.append(buildMobilePanel(brand, links, fragmentSections(footerFragment)));

  const header = el('div', 'site-header');
  header.append(el('div', 'site-header-band', { 'aria-hidden': 'true' }));
  header.append(svg(`<svg ${SVG_NS} class="site-header-tab" viewBox="0 0 189.285 62" fill="none" `
    + `aria-hidden="true"><path fill="#980186" d="${TAB_PATH}"/></svg>`));
  if (brand) header.append(brand);
  const nav = el('nav', 'site-header-nav', { 'aria-label': 'Main navigation' });
  links.forEach((a) => nav.append(goldLink(a)));
  header.append(nav);
  siteNav.append(header);

  block.replaceChildren(el('div', 'status-tint', { 'aria-hidden': 'true' }), siteNav);
}

async function decoratePromo(block) {
  const navFragment = await loadFragment(chromePath('nav'));
  const [brandSection] = fragmentSections(navFragment);
  const header = el('div', 'promo-header');
  const brand = brandLink(brandSection);
  if (brand) {
    brand.className = 'promo-header-logo';
    brand.append(
      svg(`<svg ${SVG_NS} class="promo-header-fillet promo-header-fillet-left" width="23" `
        + `height="17" viewBox="0 0 23 17" aria-hidden="true"><path d="${FILLET_LEFT}" `
        + 'fill="#980186"/></svg>'),
      svg(`<svg ${SVG_NS} class="promo-header-fillet promo-header-fillet-right" width="23" `
        + `height="17" viewBox="0 0 23 17" aria-hidden="true"><path d="${FILLET_RIGHT}" `
        + 'fill="#980186"/></svg>'),
    );
    header.append(brand);
  }
  block.replaceChildren(header);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  addSkipLink();
  if (isPromoTheme()) await decoratePromo(block);
  else await decorateSite(block);
}
