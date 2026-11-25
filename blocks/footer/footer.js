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
 * Site footer. Two themes, chosen by page metadata `Theme`:
 * - default (sling): reads /footer — 1: brand image + link, 2: "Follow us" + social links
 *   (`:social-instagram:` icons), 3: legal link list, 4: copyright line.
 * - `golden-ticket`: reads /us/en/xp/golden-ticket/footer — 1: brand image + link,
 *   2: menu link list, 3: "Follow us" + social links (`:gt-facebook:` …), 4: legal link list,
 *   5: copyright line.
 * `footer` page metadata overrides either path.
 */

const STAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" '
  + 'aria-hidden="true"><path d="M8 0L9.41 6.59L16 8L9.41 9.41L8 16L6.59 9.41L0 8L6.59 6.59L8 0Z"/>'
  + '</svg>';

function decorateSite(block, sections) {
  const [brandSection, social, legal, copy] = sections;
  const outer = el('div', 'page-footer', { 'data-cloud-avoid': '' });
  const footer = el('div', 'site-footer', { role: 'contentinfo' });
  const body = el('div', 'site-footer-body');
  const top = el('div', 'site-footer-top');

  const brand = brandLink(brandSection);
  if (brand) {
    brand.className = 'site-footer-logo';
    top.append(brand);
  }
  if (social) {
    const box = el('div', 'site-footer-social');
    const title = social.querySelector('p');
    if (title) box.append(title);
    const row = el('div', 'site-footer-social-row');
    social.querySelectorAll('a').forEach((a) => row.append(socialButton(a)));
    box.append(row);
    top.append(box);
  }
  body.append(top);

  const star = el('div', 'site-footer-star', { 'aria-hidden': 'true' });
  star.append(svg(STAR));
  body.append(star);

  if (legal) {
    const links = el('div', 'site-footer-links', { 'aria-label': 'Footer links' });
    legal.querySelectorAll('a').forEach((a) => {
      goldLink(a);
      a.className = 'legal-link';
      decorateTarget(a);
      links.append(a);
    });
    body.append(links);
  }
  footer.append(body);

  if (copy) {
    const line = el('div', 'site-footer-copy');
    line.append(...(copy.querySelector('p') || copy).childNodes);
    footer.append(line);
  }
  outer.append(footer);
  block.replaceChildren(outer);
}

function promoStar() {
  return el('span', 'promo-star', { 'aria-hidden': 'true' });
}

function decoratePromo(block, sections) {
  const [brandSection, menu, social, legal, copy] = sections;
  const footer = el('div', 'promo-footer');
  const content = el('div', 'promo-container promo-footer-content');

  const brand = brandLink(brandSection);
  if (brand) {
    const logo = el('div', 'promo-footer-logo');
    logo.append(brand);
    content.append(logo);
  }
  if (menu) {
    const box = el('div', 'promo-footer-menu');
    const list = menu.querySelector('ul');
    if (list) {
      list.className = 'promo-footer-menu-items';
      list.querySelectorAll('a').forEach((a) => {
        const here = new URL(a.href, window.location).pathname === window.location.pathname;
        if (here) {
          a.setAttribute('aria-current', 'page');
          a.closest('li').classList.add('is-active');
        }
      });
      box.append(list);
    }
    content.append(box);
  }
  content.append(promoStar());
  if (social) {
    const box = el('div', 'promo-footer-socials');
    const title = el('div', 'promo-footer-socials-title');
    const p = social.querySelector('p');
    if (p) title.append(...p.childNodes);
    const links = el('div', 'promo-footer-socials-links');
    social.querySelectorAll('a').forEach((a) => links.append(socialButton(a, '')));
    box.append(title, links);
    content.append(box);
  }
  if (legal) {
    const nav = el('nav', 'promo-footer-legal-nav', { 'aria-labelledby': 'promo-footer-heading' });
    const heading = el('h2', 'visually-hidden', { id: 'promo-footer-heading' });
    heading.textContent = 'Footer';
    const row = el('div', 'promo-footer-legal');
    const anchors = [...legal.querySelectorAll('a')];
    anchors.forEach((a, i) => {
      row.append(a);
      if (i < anchors.length - 1) row.append(promoStar());
    });
    nav.append(heading, row);
    content.append(nav);
  }
  footer.append(content);

  if (copy) {
    const bottom = el('div', 'promo-footer-bottom');
    const inner = el('div', 'promo-container');
    inner.append(...(copy.querySelector('p') || copy).childNodes);
    bottom.append(inner);
    footer.append(bottom);
  }
  block.replaceChildren(footer);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFragment(chromePath('footer'));
  const sections = fragmentSections(fragment);
  if (isPromoTheme()) decoratePromo(block, sections);
  else decorateSite(block, sections);
}
