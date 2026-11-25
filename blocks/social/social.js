/**
 * social — "Follow the Magic" band: gold title, intro text and round social buttons with a
 * caption under each (about template, source social paragraph).
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section social, repeat group LI).
 * Decode tier: reconstructive — authored nodes are MOVED by role, from any row or cell:
 *   - headings → title slot; paragraphs → text slot
 *   - a list of links (`:social-<name>: Label`) → button row; each link becomes the round
 *     icon button and its label text MOVES into the caption under it
 */
const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

function decorateItem(li) {
  const a = li.querySelector('a[href]');
  if (!a || a.classList.contains('btn')) return;
  const caption = el('span', 'social-caption');
  [...a.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE || !n.classList?.contains('icon')) caption.append(n);
  });
  const label = caption.textContent.trim();
  if (label) a.setAttribute('aria-label', label);
  a.removeAttribute('title');
  const icon = a.querySelector('.icon');
  if (icon) {
    icon.setAttribute('aria-hidden', 'true');
    icon.classList.add('btn-icon');
  }
  a.className = 'btn btn-md btn-blurred';
  if (/^https?:/.test(a.getAttribute('href')) && new URL(a.href).host !== window.location.host) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.after(caption);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .social-inner')) return; // EW9: already decorated
  const inner = el('div', 'social-inner');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    let run = null;
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE || INLINE.test(node.nodeName)) {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !run) return;
        if (!run) {
          run = el('p');
          const text = el('div', 'social-text');
          text.append(run);
          inner.append(text);
        }
        run.append(node);
        return;
      }
      run = null;
      let slot;
      if (/^H[1-6]$/.test(node.tagName)) slot = el('div', 'social-title');
      else if (node.matches('ul, ol')) {
        slot = el('div', 'social-list');
        node.querySelectorAll('li').forEach(decorateItem);
      } else slot = el('div', 'social-text');
      slot.append(node);
      inner.append(slot);
    });
  });
  [...block.children].forEach((r) => r.remove());
  block.append(inner);
  const heading = inner.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
