/**
 * coming-soon — announcement band: blurred factory backdrop, tinted panel, heading, star,
 * message, framed by cloud banks. Template-slotted: the image is MOVED into the backdrop
 * slot; headings and paragraphs are MOVED into the copy slot in authored order.
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/coming-soon/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

export default function decorate(block) {
  if (block.querySelector('.coming-soon-panel')) return;
  const section = block.closest('.section');
  if (section) section.dataset.cloudAvoid = '';

  const panel = el('div', 'coming-soon-panel');
  const bg = el('div', 'coming-soon-bg');
  const copy = el('div', 'coming-soon-copy');
  const picture = block.querySelector('picture') || block.querySelector('img');
  if (picture) bg.append(picture);

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      copy.append(node);
      if (/^H[1-6]$/.test(node.tagName || '')) {
        copy.append(el('img', 'coming-soon-star', {
          src: `${ASSETS}/decorative-star.svg`,
          alt: '',
          width: '24',
          height: '24',
          'aria-hidden': 'true',
        }));
      }
    });
  });

  panel.append(
    el('div', 'coming-soon-shade', { 'aria-hidden': 'true' }),
    el('div', 'coming-soon-tint', { 'aria-hidden': 'true' }),
    bg,
    copy,
  );
  [...block.children].forEach((row) => row.remove());
  block.append(
    el('img', 'coming-soon-clouds coming-soon-clouds-m', {
      src: `${ASSETS}/coming-soon-clouds-mobile.webp`,
      alt: '',
      width: '1005',
      height: '581',
      'aria-hidden': 'true',
    }),
    el('img', 'coming-soon-clouds coming-soon-clouds-d', {
      src: `${ASSETS}/coming-soon-clouds.webp`,
      alt: '',
      width: '1350',
      height: '568',
      'aria-hidden': 'true',
    }),
    panel,
  );
  const heading = copy.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
