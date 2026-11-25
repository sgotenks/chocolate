/**
 * promo-steps — golden-ticket "how to enter" panel: a star-bracketed title, a row of
 * illustrated steps and the entry CTAs on a light card.
 * Reconstructive (repeat group): rows are classified by content, never by index —
 * a row with a picture is a step (picture → step media, heading → step title, any other
 * element follows the title); a row of CTA paragraphs (`.button-wrapper`) → links; any
 * other row → panel title. A secondary CTA beside a primary one is for phone visitors only
 * (the source's is-desktop switch).
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/promo-steps/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const isPhone = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const SWEETS = [
  ['caramel-pop.png', 136, 136],
  ['berry_elixir.png', 99, 99],
  ['bubblegumjoy.png', 86, 86],
];

export default function decorate(block) {
  if (block.querySelector('.promo-steps-panel')) return;
  if (isPhone()) block.classList.add('is-phone');

  const panel = el('div', 'promo-steps-panel');
  const title = el('div', 'promo-steps-title');
  const list = el('div', 'promo-steps-list');
  const links = el('div', 'promo-steps-links');

  [...block.children].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    if (row.querySelector('picture, img')) {
      const step = el('div', 'promo-step');
      const media = el('div', 'promo-step-media');
      const caption = el('div', 'promo-step-title');
      nodes.forEach((node) => {
        if (node.matches('picture, img') || (node.querySelector('picture, img')
          && !node.textContent.trim())) media.append(node);
        else caption.append(node);
      });
      step.append(media, caption);
      list.append(step);
    } else if (nodes.length && nodes.every((n) => n.classList.contains('button-wrapper'))) {
      nodes.forEach((node) => {
        const slot = el('div', 'promo-steps-cta');
        const secondary = node.querySelector('a.secondary');
        if (secondary && nodes.length > 1) slot.classList.add('promo-steps-cta-phone');
        slot.append(node);
        links.append(slot);
      });
    } else {
      title.append(...nodes);
    }
  });

  [title, list, links].forEach((slot) => {
    if (slot.childNodes.length) panel.append(slot);
  });
  const container = el('div', 'promo-container');
  container.append(panel);

  const particles = el('div', 'promo-steps-particles', { 'aria-hidden': 'true' });
  const sweets = el('div', 'promo-steps-decor', { 'aria-hidden': 'true' });
  SWEETS.forEach(([file, w, h], i) => {
    sweets.append(el('img', `promo-steps-sweet promo-steps-sweet-${i + 7}`, {
      src: `${ASSETS}/${file}`,
      alt: '',
      width: String(w),
      height: String(h),
      loading: 'lazy',
    }));
  });

  [...block.children].forEach((row) => row.remove());
  block.append(particles, container, sweets);
}
