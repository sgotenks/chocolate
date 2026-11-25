/**
 * promo-visual — golden-ticket key visual: full-bleed campaign image (desktop + mobile
 * art direction), screen-blended particles and three floating sweets over its lower edge,
 * and the rounded top edge of the content panel that overlaps it.
 * Template-slotted: the first picture is MOVED into the desktop slot, the second into the
 * mobile slot (one picture serves both widths). Particles and sweets are decorative
 * (aria-hidden, code-bus assets).
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/promo-visual/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const SWEETS = [
  ['top-1', 'q1.png', 55, 55],
  ['top-2', 'q2.png', 102, 93],
  ['top-3', 'q3.png', 76, 75],
];

export default function decorate(block) {
  if (block.querySelector('.promo-visual-media')) return;
  const pictures = [...block.querySelectorAll('picture')];
  const media = pictures.length ? pictures : [...block.querySelectorAll('img')];

  const frame = el('div', 'promo-visual-media');
  media.forEach((node, i) => {
    let variant = 'all';
    if (media.length > 1) variant = i === media.length - 1 ? 'mobile' : 'desktop';
    const slot = el('div', `promo-visual-art promo-visual-art-${variant}`);
    slot.append(node);
    frame.append(slot);
  });

  const decor = el('div', 'promo-visual-decor', { 'aria-hidden': 'true' });
  decor.append(el('div', 'promo-visual-particles'));
  SWEETS.forEach(([pos, file, w, h]) => {
    decor.append(el('img', `promo-visual-sweet promo-visual-sweet-${pos}`, {
      src: `${ASSETS}/${file}`,
      alt: '',
      width: String(w),
      height: String(h),
      loading: 'lazy',
    }));
  });

  [...block.children].forEach((row) => row.remove());
  block.append(frame, decor);
}
