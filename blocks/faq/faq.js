/**
 * faq — gold title over a stack of rounded accordion items (about template, source
 * accordion paragraph): independent toggles (no auto-close), 500ms height transition,
 * plus/minus icon rotating 300ms; aria-expanded / data-expanded / aria-hidden / inert in sync.
 * Schema: stardust/eds-schema/us-en-about-wonka.json (section faq, repeat group LI.faq__item).
 * Decode tier: reconstructive — rows classified by cell count, never by index:
 *   - TWO cells → one item: cell 1 = question, cell 2 = answer (rich text)
 *   - ONE cell  → section head (heading / intro), in authored order
 * EW7: the question is not hosted by a <button> — the row is a div[role=button] (focusable,
 * Enter/Space; keys typed inside an editable region are left alone), the icon is decorative.
 */
const ASSETS = `${window.hlx?.codeBasePath || ''}/blocks/faq/assets`;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

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

const filled = (cell) => cell && (cell.textContent.trim() || cell.querySelector('img, picture'));

function buildItem(cells, index, uid) {
  const [qCell, aCell] = cells;
  const id = `${uid}-${index + 1}`;
  const li = el('li', 'faq-item', { 'data-expanded': 'false' });

  const row = el('div', 'faq-toggle', {
    role: 'button',
    tabindex: '0',
    'aria-expanded': 'false',
    'aria-controls': `${id}-panel`,
  });
  const q = el('div', 'faq-q', { id: `${id}-q` });
  moveCell(qCell, q);
  const icon = el('span', 'faq-icon', { 'aria-hidden': 'true' });
  icon.append(
    el('img', '', {
      src: `${ASSETS}/accordion-icon.svg`, alt: '', width: '12', height: '2',
    }),
    el('img', 'faq-icon-rot', {
      src: `${ASSETS}/accordion-icon.svg`, alt: '', width: '12', height: '2',
    }),
  );
  row.append(q, icon);

  const panel = el('div', 'faq-collapse', {
    id: `${id}-panel`,
    role: 'region',
    'aria-labelledby': `${id}-q`,
    'aria-hidden': 'true',
    'data-expanded': 'false',
  });
  panel.inert = true;
  const answer = el('div', 'faq-answer');
  if (aCell) moveCell(aCell, answer);
  const collapse = el('div', 'faq-collapse-inner');
  collapse.append(answer);
  panel.append(collapse);

  const set = (open) => {
    const v = open ? 'true' : 'false';
    row.setAttribute('aria-expanded', v);
    li.dataset.expanded = v;
    panel.dataset.expanded = v;
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    panel.inert = !open;
  };
  const flip = () => set(row.getAttribute('aria-expanded') !== 'true');
  row.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    flip();
  });
  row.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target !== row || e.target.isContentEditable) return;
    e.preventDefault();
    flip();
  });

  li.append(row, panel);
  return li;
}

let instances = 0;

export default function decorate(block) {
  if (block.querySelector(':scope > .faq-inner')) return; // EW9: already decorated
  instances += 1;
  const uid = `faq${instances > 1 ? instances : ''}`;
  const inner = el('div', 'faq-inner');
  const head = el('div', 'faq-title');
  const list = el('ul', 'faq-list');

  let items = 0;
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter(filled);
    if (cells.length >= 2) {
      list.append(buildItem(cells, items, uid));
      items += 1;
    } else if (cells.length === 1) {
      moveCell(cells[0], head);
    }
    row.remove();
  });

  if (head.childNodes.length) inner.append(head);
  inner.append(list);
  block.append(inner);
  const heading = head.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
}
