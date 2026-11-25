/**
 * promo-editorial — golden-ticket editorial band: star-bracketed title, body copy and CTAs
 * beside an image. Variants: `qr` (centred column: title, QR card, note) and `image-left`.
 * Template-slotted, classified by content, never by row index:
 * - the cell holding a heading is the text cell: heading → title slot, CTA paragraphs
 *   (decorated `.button-wrapper`) → links slot, other paragraphs → body slot; in `qr` the
 *   first of two or more plain paragraphs is the subtitle (kept, hidden as on the source);
 * - a cell holding only a picture → media slot;
 * - any other cell → note slot.
 * Phone user agents (the source's is-desktop switch) see the CTAs the desktop hides.
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/promo-editorial/assets`;

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

function decor(group, particles, first) {
  const wrap = el('div', `promo-editorial-decor promo-editorial-decor-${group}`, {
    'aria-hidden': 'true',
  });
  wrap.append(el('div', `promo-editorial-particles promo-editorial-particles-${particles}`));
  SWEETS.forEach(([file, w, h], i) => {
    wrap.append(el('img', `promo-editorial-sweet promo-editorial-sweet-${first + i}`, {
      src: `${ASSETS}/${file}`,
      alt: '',
      width: String(w),
      height: String(h),
      loading: 'lazy',
    }));
  });
  return wrap;
}

const isMedia = (cell) => !!cell.querySelector('picture, img')
  && !cell.textContent.trim();

export default function decorate(block) {
  if (block.querySelector('.promo-editorial-content')) return;
  const qr = block.classList.contains('qr');
  if (!qr && !block.classList.contains('image-left')) block.classList.add('image-left');
  if (isPhone()) block.classList.add('is-phone');

  const container = el('div', 'promo-container');
  const content = el('div', 'promo-editorial-content');
  const text = el('div', 'promo-editorial-text');
  const title = el('div', 'promo-editorial-title');
  const subtitle = el('div', 'promo-editorial-subtitle');
  const body = el('div', 'promo-editorial-body');
  const links = el('div', 'promo-editorial-links');
  const media = el('div', 'promo-editorial-media');
  const note = el('div', 'promo-editorial-note');

  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    if (isMedia(cell)) {
      media.append(...cell.childNodes);
      return;
    }
    if (!cell.querySelector('h1, h2, h3, h4, h5, h6')) {
      note.append(...cell.childNodes);
      return;
    }
    const nodes = [...cell.children];
    const plain = nodes.filter((n) => n.tagName === 'P' && !n.classList.contains('button-wrapper'));
    const ctas = nodes.filter((n) => n.classList.contains('button-wrapper'));
    nodes.forEach((node) => {
      if (/^H[1-6]$/.test(node.tagName)) {
        title.append(node);
      } else if (node.classList.contains('button-wrapper')) {
        const slot = el('div', 'promo-editorial-cta');
        const secondary = node.querySelector('a.secondary');
        if (secondary && ctas.length > 1) slot.classList.add('promo-editorial-cta-phone');
        slot.append(node);
        links.append(slot);
      } else if (qr && plain.length > 1 && node === plain[0]) {
        subtitle.append(node);
      } else {
        body.append(node);
      }
    });
  });

  [title, subtitle, body, links].forEach((slot) => {
    if (slot.childNodes.length) text.append(slot);
  });
  content.append(text);
  if (media.childNodes.length) content.append(media);
  if (note.childNodes.length) content.append(note);
  container.append(content);

  [...block.children].forEach((row) => row.remove());
  if (qr) {
    block.append(container, decor('mobile', '1-mob', 1));
  } else {
    block.append(decor('desktop', '2', 4), container, decor('mobile', '2-mob', 4));
  }
}
