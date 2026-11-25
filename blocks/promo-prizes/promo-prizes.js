/**
 * promo-prizes — golden-ticket prize slider: a title, then one slide per prize (title,
 * copy, rules link beside a prize image) with dot pagination.
 * Reconstructive (repeat group): a row holding a picture is a slide — the cell with the
 * picture → slide media, every other node → slide text (heading → title, CTA paragraphs
 * `.button-wrapper` → links, other paragraphs → body); any other row → slider title.
 * Motion mirrors the source: a dot click moves the track (transform 0.3s) and swaps the
 * active dot (0.6s); no autoplay. Arrows and the fraction exist but stay hidden, as on
 * the source at these widths.
 */
const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const ARROW = 'M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 '
  + '10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 '
  + '0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 '
  + '10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z';

function arrow(dir) {
  const node = el('div', `promo-prizes-arrow promo-prizes-arrow-${dir}`, { 'aria-hidden': 'true' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '11');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 11 20');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', ARROW);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  node.append(svg);
  return node;
}

function buildSlide(row, index, total) {
  const slide = el('div', 'promo-prize', {
    role: 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} / ${total}`,
  });
  const text = el('div', 'promo-prize-text');
  const title = el('div', 'promo-prize-title');
  const body = el('div', 'promo-prize-body');
  const links = el('div', 'promo-prize-links');
  const media = el('div', 'promo-prize-media');
  [...row.children].forEach((cell) => {
    const pic = cell.querySelector('picture, img');
    if (pic && !cell.textContent.trim()) {
      media.append(...cell.childNodes);
      return;
    }
    [...cell.children].forEach((node) => {
      if (/^H[1-6]$/.test(node.tagName)) title.append(node);
      else if (node.classList.contains('button-wrapper')) links.append(node);
      else body.append(node);
    });
  });
  [title, body, links].forEach((slot) => {
    if (slot.childNodes.length) text.append(slot);
  });
  slide.append(text, media);
  if (index > 0) {
    media.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'lazy'));
  }
  return slide;
}

export default function decorate(block) {
  if (block.querySelector('.promo-prizes-track')) return;
  block.setAttribute('aria-roledescription', 'carousel');

  const head = el('div', 'promo-prizes-head');
  const title = el('div', 'promo-prizes-title');
  const slideRows = [];
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img')) slideRows.push(row);
    else title.append(...row.querySelectorAll(':scope > div > *'));
  });
  if (title.childNodes.length) head.append(title);

  const viewport = el('div', 'promo-prizes-viewport');
  const track = el('div', 'promo-prizes-track');
  slideRows.forEach((row, i) => track.append(buildSlide(row, i, slideRows.length)));

  const nav = el('div', 'promo-prizes-nav');
  const dots = el('div', 'promo-prizes-dots');
  const dotButtons = slideRows.map((row, i) => {
    const dot = el('button', 'promo-prizes-dot', {
      type: 'button',
      'aria-label': `Go to slide ${i + 1}`,
    });
    dots.append(dot);
    return dot;
  });
  const arrows = el('div', 'promo-prizes-arrows');
  arrows.append(arrow('prev'), arrow('next'));
  const fraction = el('div', 'promo-prizes-fraction', { 'aria-hidden': 'true' });
  fraction.textContent = `1/${slideRows.length}`;
  nav.append(dots, arrows, fraction);
  viewport.append(track, nav);

  const go = (index) => {
    track.style.transform = `translate3d(${-100 * index}%, 0, 0)`;
    dotButtons.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    fraction.textContent = `${index + 1}/${slideRows.length}`;
  };
  dotButtons.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  if (dotButtons.length) {
    dotButtons[0].classList.add('is-active');
    dotButtons[0].setAttribute('aria-current', 'true');
  }

  const container = el('div', 'promo-container');
  container.append(head, viewport);
  [...block.children].forEach((row) => row.remove());
  block.append(container);
}
