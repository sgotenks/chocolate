/**
 * story-cards — section title over a row of frosted cards, each crowned by a round seal
 * holding an icon (about template, source story-cards paragraph).
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section scards, repeat group LI.scard).
 * Decode tier: reconstructive — rows are classified by content, never by index:
 *   - a row with an image → one card (image = seal icon; the rest of the row = card text)
 *   - any other row       → section head (heading + any intro text), in authored order
 * Decorative star bursts / seal art are code assets (first card of three bottom-right,
 * third top-left, like the source).
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/story-cards/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

// Move a cell's authored children into target; bare inline runs are wrapped in a <p>.
function moveCell(cell, target) {
  let run = null;
  [...cell.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !run) return;
    if (node.nodeType === Node.TEXT_NODE || INLINE.test(node.nodeName)) {
      if (!run) {
        run = document.createElement('p');
        target.append(run);
      }
      run.append(node);
      return;
    }
    run = null;
    if (node.nodeType === Node.ELEMENT_NODE) target.append(node);
  });
}

function stars(position) {
  const wrap = el('div', `story-cards-stars story-cards-stars-${position}`, { 'aria-hidden': 'true' });
  wrap.append(el('img', '', {
    src: `${ASSETS}/stars.webp`, alt: '', width: '741', height: '600', loading: 'lazy',
  }));
  return wrap;
}

function buildCard(row, index) {
  const li = el('li', 'story-cards-card');
  const media = row.querySelector('picture') || row.querySelector('img');
  const body = el('div', 'story-cards-body');
  const icon = el('div', 'story-cards-icon');
  if (media) {
    const holder = media.closest('p');
    icon.append(media);
    if (holder && !holder.textContent.trim() && !holder.children.length) holder.remove();
  }
  [...row.children].forEach((cell) => moveCell(cell, body));

  if (index % 3 === 0) li.append(stars('br'));
  if (index % 3 === 2) li.append(stars('tl'));
  const seal = el('div', 'story-cards-seal');
  seal.append(
    el('img', 'story-cards-seal-bg', {
      src: `${ASSETS}/seal-background.png`,
      alt: '',
      width: '100',
      height: '100',
      loading: 'lazy',
      'aria-hidden': 'true',
    }),
    icon,
  );
  li.append(
    body,
    el('img', 'story-cards-seal-stars', {
      src: `${ASSETS}/seal-stars.webp`,
      alt: '',
      width: '162',
      height: '131',
      loading: 'lazy',
      'aria-hidden': 'true',
    }),
    seal,
  );
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .story-cards-inner')) return; // EW9: already decorated
  const inner = el('div', 'story-cards-inner');
  const head = el('div', 'story-cards-title');
  const list = el('ul', 'story-cards-list');

  let cards = 0;
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img')) {
      list.append(buildCard(row, cards));
      cards += 1;
    } else {
      [...row.children].forEach((cell) => moveCell(cell, head));
    }
    row.remove();
  });

  if (head.childNodes.length) inner.append(head);
  inner.append(list);
  block.append(inner);
  const heading = head.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
