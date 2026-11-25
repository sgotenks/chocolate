/**
 * ar-banner — golden-ticket AR experience call-out (title + register CTA). The source keeps
 * it in the page but hidden at rest (it opens from the AR experience), so it ships hidden.
 * Template-slotted: CTA paragraphs (`.button-wrapper`) → action slot, every other node →
 * title slot.
 */
const el = (tag, className) => {
  const node = document.createElement(tag);
  node.className = className;
  return node;
};

export default function decorate(block) {
  if (block.querySelector('.ar-banner-title')) return;
  const title = el('div', 'ar-banner-title');
  const action = el('div', 'ar-banner-action');
  block.querySelectorAll(':scope > div > div > *').forEach((node) => {
    if (node.classList.contains('button-wrapper')) action.append(node);
    else title.append(node);
  });
  [...block.children].forEach((row) => row.remove());
  block.append(title, action);
  block.hidden = true;
}
