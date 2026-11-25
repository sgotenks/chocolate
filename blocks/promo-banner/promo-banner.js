/**
 * promo-banner — gold title + text, a product group image over a cloud bank and a gold CTA
 * (about template, source promo-section paragraph).
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section promo).
 * Decode tier: template-slotted — authored nodes are MOVED by role, from any row or cell:
 *   - headings and text paragraphs      → head slot (title / text wrappers)
 *   - images: the first is shown from 768px up, the second below (one image = all widths)
 *   - the paragraph holding a link (EDS button) → CTA slot; an arrow icon is appended
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/promo-banner/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

function authoredNodes(block) {
  const nodes = [];
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    let run = null;
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !run) return;
      if (node.nodeType === Node.TEXT_NODE || INLINE.test(node.nodeName)) {
        if (!run) {
          run = document.createElement('p');
          nodes.push(run);
        }
        run.append(node);
        return;
      }
      run = null;
      if (node.nodeType === Node.ELEMENT_NODE) nodes.push(node);
    });
  });
  return nodes;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .promo-banner-inner')) return; // EW9: already decorated
  const section = block.closest('.section');
  if (section) section.dataset.cloudAvoid = '';

  const head = el('div', 'promo-banner-head');
  const media = el('div', 'promo-banner-media');
  const cta = el('div', 'promo-banner-cta');
  const images = [];

  authoredNodes(block).forEach((node) => {
    const pic = node.matches('picture, img') ? node : null;
    const picP = !pic && node.tagName === 'P' && !node.textContent.trim()
      ? node.querySelector('picture, img') : null;
    if (pic || picP) {
      images.push(pic || picP);
      if (picP) node.remove();
    } else if (node.tagName === 'P' && node.querySelector('a[href]')
      && node.textContent.trim() === node.querySelector('a[href]').textContent.trim()) {
      const a = node.querySelector('a[href]');
      if (!a.querySelector('.btn-icon')) {
        const icon = el('span', 'btn-icon', { 'aria-hidden': 'true' });
        icon.append(el('img', '', { src: `${ASSETS}/arrow.svg`, alt: '' }));
        a.append(icon);
      }
      cta.append(node);
    } else if (/^H[1-6]$/.test(node.tagName)) {
      const title = el('div', 'promo-banner-title');
      title.append(node);
      head.append(title);
    } else {
      const text = el('div', 'promo-banner-text');
      text.append(node);
      head.append(text);
    }
  });

  images.forEach((img, i) => {
    let variant = 'promo-banner-img';
    if (images.length > 1) variant = i === 0 ? 'promo-banner-img-d' : 'promo-banner-img-m';
    const wrap = el('div', variant);
    wrap.append(img);
    media.append(wrap);
  });

  const stage = el('div', 'promo-banner-stage');
  stage.append(
    el('img', 'promo-banner-clouds', {
      src: `${ASSETS}/clouds.webp`,
      alt: '',
      width: '1718',
      height: '317',
      loading: 'lazy',
      'aria-hidden': 'true',
    }),
    media,
  );
  if (cta.childElementCount) stage.append(cta);
  const inner = el('div', 'promo-banner-inner');
  inner.append(head, stage);
  [...block.children].forEach((r) => r.remove());
  block.append(inner);
  const heading = head.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
