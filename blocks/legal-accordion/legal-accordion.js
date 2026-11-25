/**
 * legal-accordion — the legal template body (privacy policy, terms of use, cookie policy):
 * rich text passages and collapsible OneTrust-style "layer breaker" sections.
 * Schema: stardust/eds-schema/us-en-privacy-policy.json (section 0, repeat group legal-acc).
 * Decode tier: reconstructive (authors add/remove sections), classified by cell count.
 *
 * Authoring rows (any order, any number):
 *   - ONE cell  → a rich-text passage (p, h2–h6, ul/ol, table…), shown as is.
 *   - TWO cells → a collapsible section: cell 1 = the section title (an h2), cell 2 = the
 *     section body (rich text). An optional cell 3 holds the label shown while the section
 *     is open (the source's layer-breaker footer); omitted, the title stays.
 *   - FOUR+ cells → a table row; consecutive table rows form one table (the cookie list),
 *     its first row the header. Each cell is labelled with its header text (data-label) for
 *     the stacked mobile layout; the table is captioned (sr-only) by the heading before it.
 *   - A link to `#consent-settings` renders as the consent-settings button (role=button);
 *     it opens the OneTrust preference centre when the SDK is present.
 *
 * @variants block class: notice | plain | cookies (notice = the OneTrust notice body inset
 *   40px 1rem 80px; plain = the sling rich-text body, 16/21 with list markers; cookies = the
 *   OneTrust cookie policy: notice values, no inset, cookie-list headings and tables)
 * @ew-exempt caption, data-label, aria-label — generated a11y copies of authored text
 */

// Wrap an AUTHORED node in a generated wrapper that carries the layout class (EW1/EW2).
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

const INLINE = /^(A|ABBR|B|BR|CODE|EM|I|SMALL|SPAN|STRONG|SUB|SUP|U|S)$/;

// Move every authored child of a cell into target, in order. Bare inline runs (the pipeline
// unwraps a one-paragraph cell) are WRAPPED in a <p> by moving the existing nodes — never copied.
function moveCell(cell, target) {
  let run = null;
  let node = cell.firstChild;
  while (node) {
    const next = node.nextSibling;
    const isInline = node.nodeType === Node.TEXT_NODE || INLINE.test(node.nodeName);
    if (isInline) {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim() && !run) {
        node.remove();
      } else {
        if (!run) {
          run = document.createElement('p');
          target.append(run);
        }
        run.append(node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      run = null;
      target.append(node);
    } else {
      node.remove();
    }
    node = next;
  }
}

const filled = (cell) => cell
  && (cell.textContent.trim() || cell.querySelector('img, picture, table'));

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^[0-9-]+|-+$/g, '');
}

function buildSection(cells, index) {
  const [titleCell, bodyCell, openCell] = cells;
  const acc = document.createElement('div');
  acc.className = 'legal-acc';
  acc.dataset.legalAcc = '';

  const row = document.createElement('div');
  row.className = 'legal-acc-row';
  const label = wrapNode(null, 'legal-acc-label');
  moveCell(titleCell, label);
  row.append(label);

  let openLabel = null;
  if (filled(openCell)) {
    openLabel = wrapNode(null, 'legal-acc-open-label');
    moveCell(openCell, openLabel);
    openLabel.hidden = true;
    row.append(openLabel);
  }

  // In-page links target the section's heading id (the pipeline derives it from the text):
  // the id moves to the always-visible section so the link scrolls to the row.
  const sel = 'h1, h2, h3, h4, h5, h6';
  const anchor = (openLabel && openLabel.querySelector(sel)) || label.querySelector(sel);
  const heading = label.querySelector(`${sel}, p`);
  const anchorId = (anchor && (anchor.id || slug(anchor.textContent))) || '';
  if (anchor) anchor.removeAttribute('id');
  const base = anchorId || `legal-acc-${index + 1}`;
  acc.id = base;
  if (heading) heading.id = `${base}-title`;

  // EW7: the button hosts no authored text — it is the keyboard toggle; the row takes the click.
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'legal-acc-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', `${base}-panel`);
  if (heading) toggle.setAttribute('aria-labelledby', heading.id);
  else toggle.setAttribute('aria-label', 'Toggle section');
  row.append(toggle);

  const panel = wrapNode(null, 'legal-acc-panel');
  panel.id = `${base}-panel`;
  panel.setAttribute('role', 'region');
  if (heading) panel.setAttribute('aria-labelledby', heading.id);
  panel.hidden = true;
  if (bodyCell) moveCell(bodyCell, panel);

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    acc.classList.toggle('is-open', open);
    row.classList.toggle('active', open);
    panel.hidden = !open;
    if (openLabel) {
      label.hidden = open;
      openLabel.hidden = !open;
    }
  };
  row.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  acc.append(row, panel);
  return acc;
}

// Consecutive 4+-cell rows → one table; cells MOVE into th/td (EW1), labels are attributes.
function buildTable(rows, body) {
  const table = document.createElement('table');
  table.className = 'legal-cookie-table';
  // the group heading (h4) sits before the group description paragraph
  let prev = body.lastElementChild;
  if (prev && prev.tagName === 'P') prev = prev.previousElementSibling;
  if (prev && /^H[2-6]$/.test(prev.tagName)) {
    const caption = document.createElement('caption');
    caption.className = 'visually-hidden';
    caption.textContent = prev.textContent.trim();
    table.append(caption);
  }
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const labels = [];
  rows.forEach((cells, r) => {
    const tr = document.createElement('tr');
    cells.forEach((cell, c) => {
      const el = document.createElement(r ? 'td' : 'th');
      if (!r) {
        el.scope = 'col';
        labels.push(cell.textContent.trim());
      } else if (labels[c]) {
        el.dataset.label = labels[c];
      }
      el.append(...cell.childNodes);
      // the source's header cells and first-column cells hold their text directly (the other
      // cells wrap it in a content span): unwrap the paragraph the pipeline put around it
      if (!r || !c) el.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
      tr.append(el);
    });
    (r ? tbody : thead).append(tr);
  });
  table.append(thead, tbody);
  table.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (!a.getAttribute('aria-label')) {
      a.setAttribute('aria-label', `${a.textContent.trim()} Opens in a new Tab`);
    }
  });
  body.append(table);
}

// The cookie list (its h3 title, then per group an h4, a description and the table) sits in one
// positioned container, as the source's #ot-sdk-cookie-policy-v2 does: the stacked layout's
// off-screen header rows are placed against it. Elements MOVE into the wrapper.
function groupCookieList(body) {
  const tables = body.querySelectorAll(':scope > table.legal-cookie-table');
  if (!tables.length) return;
  // walk back over the first group's description and heading to the list title
  let first = tables[0];
  let prev = first.previousElementSibling;
  if (prev && prev.tagName === 'P') {
    first = prev;
    prev = prev.previousElementSibling;
  }
  if (prev && /^H[4-6]$/.test(prev.tagName)) {
    first = prev;
    prev = prev.previousElementSibling;
  }
  if (prev && /^H[2-3]$/.test(prev.tagName)) first = prev;
  const list = document.createElement('div');
  list.className = 'legal-cookie-list';
  first.before(list);
  const last = tables[tables.length - 1];
  let node = list.nextElementSibling;
  while (node) {
    const next = node.nextElementSibling;
    list.append(node);
    if (node === last) break;
    node = next;
  }
}

function decorateConsent(body) {
  // The authored link is a control, not a navigation: after reading its href the anchor is
  // unwrapped (EW6) into a generated span[role=button]; its authored text nodes MOVE into it.
  body.querySelectorAll('a[href$="#consent-settings"]').forEach((a) => {
    const btn = document.createElement('span');
    btn.className = 'legal-consent-btn';
    btn.setAttribute('role', 'button');
    btn.tabIndex = 0;
    btn.append(...a.childNodes);
    a.replaceWith(btn);
    const open = () => {
      const ot = window.OneTrust;
      if (ot && typeof ot.ToggleInfoDisplay === 'function') ot.ToggleInfoDisplay();
    };
    btn.addEventListener('click', open);
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      open();
    });
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .legal-body')) return; // EW9: already decorated
  const body = document.createElement('div');
  body.className = 'legal-body';
  if (block.classList.contains('notice')) body.classList.add('legal-body-notice');
  if (block.classList.contains('plain')) body.classList.add('legal-body-plain');
  if (block.classList.contains('cookies')) body.classList.add('legal-body-cookies');

  let sections = 0;
  let tableRows = [];
  const flushTable = () => {
    if (tableRows.length) buildTable(tableRows, body);
    tableRows = [];
  };
  [...block.children].forEach((row) => {
    const all = [...row.children];
    if (all.length >= 4) {
      tableRows.push(all);
      row.remove();
      return;
    }
    flushTable();
    const cells = all.filter(filled);
    if (cells.length >= 2) {
      body.append(buildSection(cells, sections));
      sections += 1;
    } else if (cells.length === 1) {
      moveCell(cells[0], body);
    }
    row.remove();
  });
  flushTable();

  groupCookieList(body);
  decorateConsent(body);
  block.append(body);
}
