/**
 * image-text — image beside a gold title and copy paragraphs separated by a decorative star
 * (about template, source image-text paragraph). Mobile: title, image, copy stacked centred.
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section itext).
 * Decode tier: template-slotted — authored nodes are MOVED by role, from any row or cell:
 *   - the first image          → media slot
 *   - the first heading        → title slot (beside the image from 768px up); below 768px a
 *     presentational clone (EW4: instrumentation stripped; one copy displayed per width) sits
 *     above the image, like the source's mobile title
 *   - every other element      → copy slots (one per paragraph, star between them)
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/image-text/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  node.removeAttribute('id');
  return node;
}

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
  if (block.querySelector(':scope > .image-text-inner')) return; // EW9: already decorated
  const media = el('div', 'image-text-media');
  const title = el('div', 'image-text-title image-text-title-d');
  const body = el('div', 'image-text-body');

  authoredNodes(block).forEach((node) => {
    const pic = node.matches('picture, img') ? node : null;
    const picP = !pic && node.tagName === 'P' && !node.textContent.trim()
      ? node.querySelector('picture, img') : null;
    if ((pic || picP) && !media.childElementCount) {
      media.append(pic || picP);
      if (picP) node.remove();
    } else if (/^H[1-6]$/.test(node.tagName) && !title.childElementCount) {
      title.append(node);
    } else {
      if (body.childElementCount) {
        body.append(el('img', 'image-text-star', {
          src: `${ASSETS}/decorative-star.svg`,
          alt: '',
          width: '24',
          height: '24',
          'aria-hidden': 'true',
        }));
      }
      const copy = el('div', 'image-text-copy');
      copy.append(node);
      body.append(copy);
    }
  });

  const text = el('div', 'image-text-text');
  text.append(title, body);
  const row = el('div', 'image-text-row');
  const heading = title.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const titleM = el('div', 'image-text-title image-text-title-m');
    titleM.append(stripInstrumentation(heading.cloneNode(true)));
    row.append(titleM);
  }
  row.append(media, text);
  const inner = el('div', 'image-text-inner');
  inner.append(row);
  [...block.children].forEach((r) => r.remove());
  block.append(inner);
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
