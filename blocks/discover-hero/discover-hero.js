/**
 * discover-hero — full-viewport intro band of the about template: book illustration over a
 * purple gradient, gold dust, cloud banks, eyebrow + h1 + intro text and a "Scroll Down" button.
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section dhero).
 * Decode tier: template-slotted — authored nodes are MOVED into empty slots by role:
 *   - the image (picture/img)          → book slot
 *   - paragraphs before the heading    → eyebrow slot
 *   - the heading (h1)                 → title slot
 *   - paragraphs after the heading     → text slot
 *   - the paragraph holding a link     → scroll button (its text becomes the visible hint)
 * The link scrolls (eased) to its #hash target, else to the next section, which takes the
 * hash as its id when nothing else carries it.
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/discover-hero/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const deco = (file, className, w, h) => el('img', className, {
  src: `${ASSETS}/${file}`, alt: '', width: w, height: h, 'aria-hidden': 'true',
});

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

// Authored nodes of every cell in order; bare inline runs are wrapped (moved) into a <p>.
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

function easeScroll(target) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.scrollIntoView({ block: 'start' });
    return;
  }
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - ((-2 * p + 2) ** 3) / 2);
  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + startY;
  const duration = Math.min(2600, Math.max(1200, (Math.abs(targetY - startY) / 700) * 1000));
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function decorateScroll(p, section, slot) {
  const a = p.querySelector('a[href]');
  const hint = el('span', 'discover-hero-hint', { 'aria-hidden': 'true' });
  hint.append(...a.childNodes);
  const label = hint.textContent.trim() || 'Scroll Down';
  a.setAttribute('aria-label', label);
  a.removeAttribute('title');
  a.className = 'btn btn-md btn-blurred discover-hero-cta';
  const icon = el('span', 'btn-icon', { 'aria-hidden': 'true' });
  icon.append(el('img', '', { src: `${ASSETS}/arrow-down.svg`, alt: '' }));
  a.append(icon);
  p.classList.remove('button-wrapper');
  p.append(hint);
  slot.append(el('div', 'discover-hero-glow', { 'aria-hidden': 'true' }), p);

  const hash = (a.getAttribute('href') || '').startsWith('#') ? a.getAttribute('href').slice(1) : '';
  const next = section && section.nextElementSibling;
  if (hash && next && !next.id && !document.getElementById(hash)) next.id = hash;
  a.addEventListener('click', (event) => {
    const target = (hash && document.getElementById(hash)) || next;
    if (!target) return;
    event.preventDefault();
    easeScroll(target);
  });
}

export default function decorate(block) {
  if (block.querySelector('.discover-hero-copy')) return; // EW9: already decorated
  const section = block.closest('.section');
  if (section) section.dataset.cloudAvoid = '';

  const book = el('div', 'discover-hero-book');
  const eyebrow = el('div', 'discover-hero-eyebrow');
  const title = el('div', 'discover-hero-title');
  const text = el('div', 'discover-hero-text');
  const scroll = el('div', 'discover-hero-scroll');

  let headingSeen = false;
  let ctaP = null;
  authoredNodes(block).forEach((node) => {
    const tag = node.tagName;
    if (tag === 'PICTURE' || tag === 'IMG' || (tag === 'P' && node.querySelector('picture, img')
      && !node.textContent.trim())) {
      if (!book.childElementCount) book.append(node.querySelector('picture, img') || node);
      else text.append(node);
    } else if (/^H[1-6]$/.test(tag)) {
      if (!title.childElementCount) title.append(node);
      else text.append(node);
      headingSeen = true;
    } else if (tag === 'P' && node.querySelector('a[href]') && !ctaP) {
      ctaP = node;
    } else if (headingSeen) {
      text.append(node);
    } else {
      eyebrow.append(node);
    }
  });

  const bg = el('div', 'discover-hero-bg');
  bg.append(
    book,
    el('div', 'discover-hero-band', { 'aria-hidden': 'true' }),
    el('div', 'discover-hero-fade', { 'aria-hidden': 'true' }),
    (() => {
      const dust = el('div', 'discover-hero-dust', { 'aria-hidden': 'true' });
      dust.append(deco('gold-dust.webp', '', '512', '414'));
      return dust;
    })(),
    deco('clouds-top-left.webp', 'discover-hero-cloud discover-hero-cloud-tl', '482', '302'),
    deco('clouds-top-right.webp', 'discover-hero-cloud discover-hero-cloud-tr', '493', '302'),
    el('div', 'discover-hero-foot', { 'aria-hidden': 'true' }),
  );

  const titles = el('div', 'discover-hero-titles');
  titles.append(eyebrow, title);
  const copy = el('div', 'discover-hero-copy');
  copy.append(titles, text);

  [...block.children].forEach((row) => row.remove());
  block.append(
    bg,
    deco('clouds-mobile.webp', 'discover-hero-clouds discover-hero-clouds-m', '375', '210'),
    deco('clouds-desktop.webp', 'discover-hero-clouds discover-hero-clouds-d', '2500', '461'),
    copy,
  );
  if (ctaP) {
    decorateScroll(ctaP, section, scroll);
    block.append(scroll);
  }
  const heading = title.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
